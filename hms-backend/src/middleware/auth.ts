import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at?: string;
}

// req.user 를 모든 Express Request 에서 사용 가능하도록 전역 확장
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

const JWT_SECRET = process.env.JWT_SECRET || 'htmg-dev-secret-change-in-production';

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: '인증이 필요합니다' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    query<{ id: string; email: string; name: string; role: string; created_at: string }>(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [decoded.userId]
    )
      .then((result) => {
        const user = result.rows[0];

        if (!user) {
          res.status(401).json({ error: '사용자를 찾을 수 없습니다' });
          return;
        }

        req.user = user;
        next();
      })
      .catch((err) => {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: '서버 오류가 발생했습니다' });
      });
  } catch {
    res.status(401).json({ error: '유효하지 않은 토큰입니다' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: '인증이 필요합니다' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: '이 작업에 대한 권한이 없습니다' });
      return;
    }

    next();
  };
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export { JWT_SECRET };
