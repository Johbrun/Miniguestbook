// Profile routes for the authenticated user.
import { Router } from 'express';
import multer from 'multer';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { mkdirSync } from 'node:fs';
import { db, type UserRow } from '../db.js';
import { logger } from '../logger.js';
import { requireAuth } from '../middleware/auth.js';

export const profileRouter = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadDir = join(__dirname, '..', '..', 'uploads');
mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const name = `user_${req.user?.id ?? 'anon'}_${Date.now()}${extname(file.originalname)}`;
    cb(null, name);
  },
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// Columns a profile update is allowed to touch.
const PROFILE_COLUMNS = ['pseudo', 'email', 'firstname', 'lastname', 'photo', 'role'];

// GET /api/profile — the current user's own profile.
profileRouter.get('/', requireAuth, (req, res) => {
  const u = req.user!;
  res.json({
    id: u.id,
    pseudo: u.pseudo,
    email: u.email,
    firstname: u.firstname,
    lastname: u.lastname,
    photo: u.photo,
    role: u.role,
  });
});

// PUT /api/profile — update the current user's profile.
profileRouter.put('/', requireAuth, (req, res) => {
  const body = req.body ?? {};
  const keys = Object.keys(body).filter((k) => PROFILE_COLUMNS.includes(k));
  if (keys.length === 0) {
    res.status(400).json({ error: 'No updatable fields provided' });
    return;
  }

  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => body[k]);

  try {
    db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`).run(...values, req.user!.id);
  } catch (err) {
    const e = err as Error;
    if (/UNIQUE/.test(e.message)) {
      res.status(409).json({ error: 'pseudo or email already taken' });
      return;
    }
    throw err;
  }

  logger.update('profile', req.user!.id, req.user!.pseudo);
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.id) as UserRow;
  res.json({
    id: updated.id,
    pseudo: updated.pseudo,
    email: updated.email,
    firstname: updated.firstname,
    lastname: updated.lastname,
    photo: updated.photo,
    role: updated.role,
  });
});

// POST /api/profile/photo — upload a profile picture.
profileRouter.post('/photo', requireAuth, upload.single('photo'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  const photoUrl = `/uploads/${req.file.filename}`;
  db.prepare('UPDATE users SET photo = ? WHERE id = ?').run(photoUrl, req.user!.id);
  res.json({ photo: photoUrl });
});
