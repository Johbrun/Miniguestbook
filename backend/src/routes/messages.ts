// Guestbook message routes.
import { Router } from 'express';
import serialize from 'node-serialize';
import { db, type MessageRow } from '../db.js';
import { logger } from '../logger.js';
import { requireAuth } from '../middleware/auth.js';

export const messagesRouter = Router();

// Remove <script> tags from user content before storing it.
function stripScripts(input: string): string {
  return input
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?script\b[^>]*>/gi, '');
}

// Default display preferences for the guestbook.
const DEFAULT_PREFS = { sort: 'desc' };

// Reads the visitor's display preferences from the `prefs` cookie.
function readPrefs(prefsCookie: string | undefined): { sort: string } {
  if (!prefsCookie) return DEFAULT_PREFS;
  try {
    const decoded = Buffer.from(prefsCookie, 'base64').toString('utf8');
    const prefs = serialize.unserialize(decoded);
    return { sort: prefs.sort === 'asc' ? 'asc' : 'desc' };
  } catch {
    return DEFAULT_PREFS;
  }
}

// GET /api/messages — list messages (optionally filtered by ?q=) honouring display preferences.
messagesRouter.get('/', (req, res) => {
  const prefs = readPrefs(req.cookies?.prefs);
  const order = prefs.sort === 'asc' ? 'ASC' : 'DESC';
  const q = typeof req.query.q === 'string' ? req.query.q : '';

  if (q) {
    const sql = `SELECT id, user_id, pseudo, content, created_at
                 FROM messages
                 WHERE hidden = 0 AND content LIKE '%${q}%'
                 ORDER BY created_at ${order}`;
    try {
      const rows = db.prepare(sql).all();
      res.json(rows);
    } catch (err) {
      const e = err as Error;
      res.status(500).json({
        error: 'SQL error while searching messages',
        message: e.message,
        query: sql,
        stack: e.stack,
      });
    }
    return;
  }

  const rows = db
    .prepare(
      `SELECT id, user_id, pseudo, content, created_at
       FROM messages WHERE hidden = 0 ORDER BY created_at ${order}`,
    )
    .all();
  res.json(rows);
});

// POST /api/messages — post a new message (no account required; pseudo is free).
messagesRouter.post('/', (req, res) => {
  const { pseudo, content } = req.body ?? {};
  if (!pseudo || !content) {
    res.status(400).json({ error: 'pseudo and content are required' });
    return;
  }

  // A pseudo reserved by a registered account can only be used by that logged-in account.
  const owner = db.prepare('SELECT id FROM users WHERE pseudo = ?').get(pseudo) as
    | { id: number }
    | undefined;
  if (owner && req.user?.id !== owner.id) {
    res.status(409).json({
      error: 'Ce pseudo est réservé à un compte. Connectez-vous pour publier avec ce pseudo.',
    });
    return;
  }

  const cleaned = stripScripts(String(content));
  const userId = req.user?.id ?? null;

  const info = db
    .prepare('INSERT INTO messages (user_id, pseudo, content) VALUES (?, ?, ?)')
    .run(userId, pseudo, cleaned);

  res.status(201).json({ id: info.lastInsertRowid, pseudo, content: cleaned });
});

// PUT /api/messages/:id — edit one of your own messages.
messagesRouter.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id) as
    | MessageRow
    | undefined;
  if (!message) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  if (message.user_id !== req.user!.id && req.user!.role !== 'admin') {
    res.status(403).json({ error: 'You can only edit your own messages' });
    return;
  }

  const cleaned = stripScripts(String(req.body?.content ?? ''));
  db.prepare('UPDATE messages SET content = ? WHERE id = ?').run(cleaned, id);
  logger.update('message', id, req.user!.pseudo);
  res.json({ id, content: cleaned });
});

// DELETE /api/messages/:id — delete one of your own messages (or any, as admin).
messagesRouter.delete('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id) as
    | MessageRow
    | undefined;
  if (!message) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  if (message.user_id !== req.user!.id && req.user!.role !== 'admin') {
    res.status(403).json({ error: 'You can only delete your own messages' });
    return;
  }

  db.prepare('DELETE FROM messages WHERE id = ?').run(id);
  logger.remove('message', id, req.user!.pseudo);
  res.json({ ok: true });
});
