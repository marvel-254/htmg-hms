import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Common SELECT with JOINs
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

// Get all appointments
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query(`${APPT_SELECT} ORDER BY a.appt_date, a.appt_time DESC`);
    res.json({ appointments: result.rows });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get appointment by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(`${APPT_SELECT} WHERE a.id = $1`, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    res.json({ appointment: result.rows[0] });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create appointment (receptionist and above) - with conflict check
router.post('/', authMiddleware, requireRole('admin', 'receptionist'), async (req: Request, res: Response) => {
  try {
    const { patient_id, doctor_id, appt_date, appt_time } = req.body;

    if (!patient_id || !doctor_id || !appt_date || !appt_time) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Verify patient exists
    const patient = await query('SELECT id FROM patients WHERE id = $1', [patient_id]);
    if (patient.rows.length === 0) {
      res.status(400).json({ error: 'Patient not found' });
      return;
    }

    // Verify doctor exists
    const doctor = await query('SELECT id FROM doctors WHERE id = $1', [doctor_id]);
    if (doctor.rows.length === 0) {
      res.status(400).json({ error: 'Doctor not found' });
      return;
    }

    // Conflict check: same doctor, same date, same time
    const conflict = await query(
      'SELECT id FROM appointments WHERE doctor_id = $1 AND appt_date = $2 AND appt_time = $3',
      [doctor_id, appt_date, appt_time]
    );

    if (conflict.rows.length > 0) {
      res.status(409).json({
        error: 'Scheduling conflict: this doctor already has an appointment at this time',
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

    res.status(201).json({ message: 'Appointment booked', appointment: appointment.rows[0], conflict: false });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update appointment status (doctor and above)
router.put('/:id/status', authMiddleware, requireRole('admin', 'doctor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const result = await query(
      'UPDATE appointments SET status = $1 WHERE id = $2',
      [status, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    const updated = await query(`${APPT_SELECT} WHERE a.id = $1`, [id]);

    res.json({ message: `Appointment status updated to "${status}"`, appointment: updated.rows[0] });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete appointment (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM appointments WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
