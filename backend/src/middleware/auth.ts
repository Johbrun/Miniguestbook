// Authentication & authorization middleware.
import type { Request, Response, NextFunction } from 'express';
import { db, type UserRow } from '../db.js';

// Augment Express' Request with the authenticated user.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserRow;
    }
  }
}

// Reads the session token from the cookie or the Authorization header and resolves the user.
export function loadUser(req: Request, _res: Response, next: NextFunction): void {
  const headerToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const token = req.cookies?.session || headerToken;

  if (token) {
    const session = db.prepare('SELECT user_id FROM sessions WHERE token = ?').get(token) as
      | { user_id: number }
      | undefined;
    if (session) {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id) as
        | UserRow
        | undefined;
      if (user) req.user = user;
    }
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin role required' });
    return;
  }
  next();
}
