import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all patients
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name, age, gender, contact, address, condition, created_by, created_at FROM patients ORDER BY created_at DESC'
    );
    res.json({ patients: result.rows });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search patients
router.get('/search', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Search query required' });
      return;
    }

    const result = await query(
      `SELECT id, name, age, gender, contact, address, condition, created_by, created_at 
       FROM patients 
       WHERE name ILIKE $1 OR contact ILIKE $1
       ORDER BY name`,
      [`%${q}%`]
    );
    res.json({ patients: result.rows });
  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get patient by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, name, age, gender, contact, address, condition, created_by, created_at FROM patients WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.json({ patient: result.rows[0] });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create patient
router.post('/', authMiddleware, requireRole('admin', 'receptionist'), async (req: Request, res: Response) => {
  try {
    const { name, age, gender, contact, address, condition } = req.body;

    if (!name || !age || !gender) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const id = uuidv4();
    const created_by = req.user!.id;

    const result = await query(
      `INSERT INTO patients (id, name, age, gender, contact, address, condition, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, age, gender, contact, address, condition, created_by, created_at`,
      [id, name, age, gender, contact || null, address || null, condition || null, created_by]
    );

    res.status(201).json({ message: 'Patient registered', patient: result.rows[0] });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update patient
router.put('/:id', authMiddleware, requireRole('admin', 'receptionist'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, gender, contact, address, condition } = req.body;

    const result = await query(
      `UPDATE patients
       SET name = COALESCE($1, name),
           age = COALESCE($2, age),
           gender = COALESCE($3, gender),
           contact = COALESCE($4, contact),
           address = COALESCE($5, address),
           condition = COALESCE($6, condition)
       WHERE id = $7
       RETURNING id, name, age, gender, contact, address, condition, created_by, created_at`,
      [name || null, age || null, gender || null, contact || null, address || null, condition || null, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.json({ message: 'Patient updated', patient: result.rows[0] });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete patient
router.delete('/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM patients WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.json({ message: 'Patient deleted' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
