import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// 환자 목록 조회 (로그인 사용자 모두 가능)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, age, gender, contact, address, condition, created_by, created_at FROM patients ORDER BY created_at DESC'
    );
    res.json({ patients: result.rows });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 환자 검색
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: '검색어를 입력하세요' });
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
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 환자 상세 조회
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, name, age, gender, contact, address, condition, created_by, created_at FROM patients WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: '환자를 찾을 수 없습니다' });
      return;
    }

    res.json({ patient: result.rows[0] });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 환자 생성 (접수자 이상)
router.post('/', authMiddleware, requireRole('admin', 'receptionist'), async (req, res) => {
  try {
    const { name, age, gender, contact, address, condition } = req.body;

    if (!name || !age || !gender) {
      res.status(400).json({ error: '필수 정보가 누락되었습니다' });
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

    res.status(201).json({ message: '환자가 등록되었습니다', patient: result.rows[0] });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 환자 수정 (관리자, 접수자)
router.put('/:id', authMiddleware, requireRole('admin', 'receptionist'), async (req, res) => {
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
      res.status(404).json({ error: '환자를 찾을 수 없습니다' });
      return;
    }

    res.json({ message: '환자 정보가 수정되었습니다', patient: result.rows[0] });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 환자 삭제 (관리자만)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM patients WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: '환자를 찾을 수 없습니다' });
      return;
    }

    res.json({ message: '환자가 삭제되었습니다' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

export default router;
