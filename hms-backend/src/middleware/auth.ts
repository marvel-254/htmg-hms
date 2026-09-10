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

// Extend Express Request to include user
declare global {
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
    res.status(401).json({ error: 'Authentication required' });
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
          res.status(401).json({ error: 'User not found' });
          return;
        }

        req.user = user;
        next();
      })
      .catch((err) => {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Server error' });
      });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export { JWT_SECRET };
