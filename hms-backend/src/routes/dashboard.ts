import express from 'express';
import { query } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 통계 조회 (인증 필요, 모든 역할)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        (SELECT COUNT(*) FROM patients) AS "totalPatients",
        (SELECT COUNT(*) FROM doctors) AS "totalDoctors",
        (SELECT COUNT(*) FROM appointments) AS "totalAppointments",
        (SELECT COUNT(*) FROM appointments WHERE status = 'pending') AS "pendingAppointments",
        (SELECT COUNT(*) FROM appointments WHERE status = 'confirmed') AS "confirmedAppointments",
        (SELECT COUNT(*) FROM appointments WHERE status = 'completed') AS "completedAppointments"
    `);
    // pg returns BIGINT counts as strings — convert to numbers
    const stats = {
      totalPatients: Number(result.rows[0].totalPatients),
      totalDoctors: Number(result.rows[0].totalDoctors),
      totalAppointments: Number(result.rows[0].totalAppointments),
      pendingAppointments: Number(result.rows[0].pendingAppointments),
      confirmedAppointments: Number(result.rows[0].confirmedAppointments),
      completedAppointments: Number(result.rows[0].completedAppointments),
    };
    res.json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 최근 활동 (인증 필요)
router.get('/recent-activity', authMiddleware, async (req, res) => {
  try {
    const recentPatients = await query(
      'SELECT id, name, age, gender, created_at FROM patients ORDER BY created_at DESC LIMIT 5'
    );
    const recentAppointments = await query(
      `SELECT a.id, a.appt_date, a.appt_time, a.status, p.name as patient_name, d.name as doctor_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       ORDER BY a.created_at DESC LIMIT 10`
    );
    res.json({ recentPatients: recentPatients.rows, recentAppointments: recentAppointments.rows });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

export default router;
