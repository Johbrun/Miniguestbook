// Admin-only moderation routes.
import { Router } from 'express';
import { db } from '../db.js';
import { logger } from '../logger.js';
import { requireAdmin } from '../middleware/auth.js';

export const adminRouter = Router();

// All routes below require the admin role.
adminRouter.use(requireAdmin);

// GET /api/admin/messages — list every message, including hidden ones.
adminRouter.get('/messages', (_req, res) => {
  const rows = db
    .prepare(
      'SELECT id, user_id, pseudo, content, hidden, created_at FROM messages ORDER BY created_at DESC',
    )
    .all();
  res.json(rows);
});

// PATCH /api/admin/messages/:id — hide or show a message (a posteriori moderation).
adminRouter.patch('/messages/:id', (req, res) => {
  const id = Number(req.params.id);
  const hidden = req.body?.hidden ? 1 : 0;
  db.prepare('UPDATE messages SET hidden = ? WHERE id = ?').run(hidden, id);
  logger.update('message(moderation)', id, req.user!.pseudo);
  res.json({ id, hidden });
});

// DELETE /api/admin/messages/:id — permanently remove a message.
adminRouter.delete('/messages/:id', (req, res) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM messages WHERE id = ?').run(id);
  logger.remove('message', id, req.user!.pseudo);
  res.json({ ok: true });
});

// GET /api/admin/users — list users with their real names (admin-only data).
adminRouter.get('/users', (_req, res) => {
  const rows = db
    .prepare(
      'SELECT id, pseudo, email, firstname, lastname, role, created_at FROM users ORDER BY id ASC',
    )
    .all();
  res.json(rows);
});
