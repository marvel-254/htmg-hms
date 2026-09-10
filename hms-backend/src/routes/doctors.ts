import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all doctors
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name, specialization, contact, schedule, created_at FROM doctors ORDER BY name'
    );
    res.json({ doctors: result.rows });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search doctors
router.get('/search', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Search query required' });
      return;
    }

    const result = await query(
      `SELECT id, name, specialization, contact, schedule, created_at 
       FROM doctors 
       WHERE name ILIKE $1 OR specialization ILIKE $1
       ORDER BY name`,
      [`%${q}%`]
    );
    res.json({ doctors: result.rows });
  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, name, specialization, contact, schedule, created_at FROM doctors WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    res.json({ doctor: result.rows[0] });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create doctor (admin only)
router.post('/', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { name, specialization, contact, schedule } = req.body;

    if (!name || !specialization) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const id = uuidv4();

    const result = await query(
      `INSERT INTO doctors (id, name, specialization, contact, schedule)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, specialization, contact, schedule, created_at`,
      [id, name, specialization, contact || null, schedule || null]
    );

    res.status(201).json({ message: 'Doctor registered', doctor: result.rows[0] });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update doctor (admin only)
router.put('/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, specialization, contact, schedule } = req.body;

    const result = await query(
      `UPDATE doctors
       SET name = COALESCE($1, name),
           specialization = COALESCE($2, specialization),
           contact = COALESCE($3, contact),
           schedule = COALESCE($4, schedule)
       WHERE id = $5
       RETURNING id, name, specialization, contact, schedule, created_at`,
      [name || null, specialization || null, contact || null, schedule || null, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    res.json({ message: 'Doctor updated', doctor: result.rows[0] });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete doctor (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM doctors WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
