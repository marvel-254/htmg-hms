import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// 공통 SELECT (JOIN)
const APPT_SELECT = `
  SELECT
    a.id, a.appt_date, a.appt_time, a.status, a.created_at,
    p.id as patient_id, p.name as patient_name, p.age as patient_age, p.gender as patient_gender,
    d.id as doctor_id, d.name as doctor_name, d.specialization,
    u.name as booked_by_name
  FROM appointments a
  JOIN patients p ON a.patient_id = p.id
  JOIN doctors d ON a.doctor_id = d.id
  JOIN users u ON a.booked_by = u.id`;

// 예약 목록 조회
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await query(`${APPT_SELECT} ORDER BY a.appt_date, a.appt_time DESC`);
    res.json({ appointments: result.rows });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 예약 상세 조회
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`${APPT_SELECT} WHERE a.id = $1`, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: '예약을 찾을 수 없습니다' });
      return;
    }

    res.json({ appointment: result.rows[0] });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 예약 생성 (접수자 이상) - 충돌 검사 포함
router.post('/', authMiddleware, requireRole('admin', 'receptionist'), async (req, res) => {
  try {
    const { patient_id, doctor_id, appt_date, appt_time } = req.body;

    if (!patient_id || !doctor_id || !appt_date || !appt_time) {
      res.status(400).json({ error: '필수 정보가 누락되었습니다' });
      return;
    }

    // 환자 존재 확인
    const patient = await query('SELECT id FROM patients WHERE id = $1', [patient_id]);
    if (patient.rows.length === 0) {
      res.status(400).json({ error: '존재하지 않는 환자입니다' });
      return;
    }

    // 의사 존재 확인
    const doctor = await query('SELECT id FROM doctors WHERE id = $1', [doctor_id]);
    if (doctor.rows.length === 0) {
      res.status(400).json({ error: '존재하지 않는 의사입니다' });
      return;
    }

    // 충돌 검사: 같은 의사, 같은 날짜, 같은 시간
    const conflict = await query(
      'SELECT id FROM appointments WHERE doctor_id = $1 AND appt_date = $2 AND appt_time = $3',
      [doctor_id, appt_date, appt_time]
    );

    if (conflict.rows.length > 0) {
      res.status(409).json({
        error: '예약 충돌: 해당 의사는 이미 같은 시간에 예약이 있습니다',
        conflicting_appointment_id: conflict.rows[0].id
      });
      return;
    }

    const id = uuidv4();
    const booked_by = req.user!.id;

    await query(
      'INSERT INTO appointments (id, patient_id, doctor_id, appt_date, appt_time, status, booked_by) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, patient_id, doctor_id, appt_date, appt_time, 'pending', booked_by]
    );

    const appointment = await query(`${APPT_SELECT} WHERE a.id = $1`, [id]);

    res.status(201).json({ message: '예약이 완료되었습니다', appointment: appointment.rows[0], conflict: false });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 예약 상태 변경 (의사 이상)
router.put('/:id/status', authMiddleware, requireRole('admin', 'doctor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed'].includes(status)) {
      res.status(400).json({ error: '유효하지 않은 상태입니다' });
      return;
    }

    const result = await query(
      'UPDATE appointments SET status = $1 WHERE id = $2',
      [status, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: '예약을 찾을 수 없습니다' });
      return;
    }

    const updated = await query(`${APPT_SELECT} WHERE a.id = $1`, [id]);

    res.json({ message: `예약 상태가 "${status}"로 변경되었습니다`, appointment: updated.rows[0] });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 예약 삭제 (관리자만)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM appointments WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: '예약을 찾을 수 없습니다' });
      return;
    }

    res.json({ message: '예약이 삭제되었습니다' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

export default router;
