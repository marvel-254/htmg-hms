import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// 의사 목록 조회
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, specialization, contact, schedule, created_at FROM doctors ORDER BY name'
    );
    res.json({ doctors: result.rows });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 의사 검색
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: '검색어를 입력하세요' });
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
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 의사 상세 조회
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, name, specialization, contact, schedule, created_at FROM doctors WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: '의사를 찾을 수 없습니다' });
      return;
    }

    res.json({ doctor: result.rows[0] });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 의사 생성 (관리자만)
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { name, specialization, contact, schedule } = req.body;

    if (!name || !specialization) {
      res.status(400).json({ error: '필수 정보가 누락되었습니다' });
      return;
    }

    const id = uuidv4();

    const result = await query(
      `INSERT INTO doctors (id, name, specialization, contact, schedule)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, specialization, contact, schedule, created_at`,
      [id, name, specialization, contact || null, schedule || null]
    );

    res.status(201).json({ message: '의사가 등록되었습니다', doctor: result.rows[0] });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 의사 수정 (관리자만)
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
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
      res.status(404).json({ error: '의사를 찾을 수 없습니다' });
      return;
    }

    res.json({ message: '의사 정보가 수정되었습니다', doctor: result.rows[0] });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 의사 삭제 (관리자만)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM doctors WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: '의사를 찾을 수 없습니다' });
      return;
    }

    res.json({ message: '의사가 삭제되었습니다' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

export default router;
