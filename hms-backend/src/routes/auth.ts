import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';
import { authMiddleware, generateToken } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../config/schemas.js';

const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message });
      return;
    }

    const { email, password, name, role } = result.data;

    // 이메일 중복 확인
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(400).json({ error: '이미 등록된 이메일입니다' });
      return;
    }

    // 비밀번호 해시
    const password_hash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    // 사용자 생성
    await query(
      'INSERT INTO users (id, email, password_hash, name, role) VALUES ($1, $2, $3, $4, $5)',
      [id, email, password_hash, name, role]
    );

    const token = generateToken(id);

    res.status(201).json({
      message: '회원가입 성공',
      user: {
        id,
        email,
        name,
        role
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message });
      return;
    }

    const { email, password } = result.data;

    const userResult = await query<{ id: string; email: string; password_hash: string; name: string; role: string; created_at: string }>(
      'SELECT id, email, password_hash, name, role, created_at FROM users WHERE email = $1',
      [email]
    );
    const user = userResult.rows[0];

    if (!user) {
      res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      message: '로그인 성공',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 현재 사용자 정보
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// 로그아웃 (클라이언트에서 토큰 삭제)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: '로그아웃 완료' });
});

// 모든 사용자 목록 (관리자만)
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: users.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

// 사용자 역할 변경 (관리자만)
router.put('/users/:id/role', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'receptionist', 'doctor'].includes(role)) {
      res.status(400).json({ error: '유효하지 않은 역할입니다' });
      return;
    }

    const result = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, name, role, created_at',
      [role, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
      return;
    }

    res.json({ message: '역할이 변경되었습니다', user: result.rows[0] });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

export default router;
