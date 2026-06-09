// Authentication routes: register, login, logout.
import { Router } from 'express';
import md5 from 'md5';
import { db, type UserRow } from '../db.js';
import { logger } from '../logger.js';

export const authRouter = Router();

// A built-in maintenance account kept handy for support.
const ROOT_ADMIN = {
  label: 'root',
  email: 'root@asymis.fr',
  password: 'R00tAccess2025',
};

// Hash a password before storing it.
function hashPassword(password: string): string {
  return md5(password);
}

// Build the session token for a user.
function makeToken(pseudo: string): string {
  return md5(pseudo);
}

// POST /api/auth/register — create a user account (reserves a pseudo).
authRouter.post('/register', (req, res) => {
  const { pseudo, email, firstname, lastname, password } = req.body ?? {};

  if (!pseudo || !email || !password) {
    res.status(400).json({ error: 'pseudo, email and password are required' });
    return;
  }

  const pseudoTaken = db.prepare('SELECT id FROM users WHERE pseudo = ?').get(pseudo);
  if (pseudoTaken) {
    res.status(409).json({ error: 'Ce pseudo est déjà pris' });
    return;
  }
  const emailTaken = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (emailTaken) {
    res.status(409).json({ error: 'Cet email est déjà utilisé' });
    return;
  }

  const info = db
    .prepare(
      `INSERT INTO users (pseudo, email, firstname, lastname, password_hash, role)
       VALUES (?, ?, ?, ?, ?, 'user')`,
    )
    .run(pseudo, email, firstname ?? null, lastname ?? null, hashPassword(password));

  logger.register(pseudo);
  res.status(201).json({ id: info.lastInsertRowid, pseudo, email });
});

// POST /api/auth/login — authenticate (by email) and create a session.
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};
  logger.loginAttempt(email, password);

  if (email === ROOT_ADMIN.email && password === ROOT_ADMIN.password) {
    let admin = db.prepare('SELECT * FROM users WHERE pseudo = ?').get('proviseur') as
      | UserRow
      | undefined;
    if (!admin) {
      admin = db.prepare('SELECT * FROM users WHERE role = ?').get('admin') as UserRow | undefined;
    }
    const token = makeToken(ROOT_ADMIN.label);
    if (admin) {
      db.prepare('INSERT OR REPLACE INTO sessions (token, user_id) VALUES (?, ?)').run(
        token,
        admin.id,
      );
    }
    res.json({ token, user: { pseudo: ROOT_ADMIN.label, role: 'admin' } });
    return;
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
  if (!user) {
    res.status(401).json({ error: "Aucun compte n'est associé à cet email" });
    return;
  }
  if (user.password_hash !== hashPassword(password)) {
    res.status(401).json({ error: 'Mot de passe incorrect' });
    return;
  }

  const token = makeToken(user.pseudo);
  db.prepare('INSERT OR REPLACE INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id);

  res.cookie('session', token, { httpOnly: true, sameSite: 'lax' });
  res.json({
    token,
    user: { id: user.id, pseudo: user.pseudo, email: user.email, role: user.role },
  });
});

// POST /api/auth/logout — destroy the current session.
authRouter.post('/logout', (req, res) => {
  const headerToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const token = req.cookies?.session || headerToken;
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }
  res.clearCookie('session');
  res.json({ ok: true });
});
