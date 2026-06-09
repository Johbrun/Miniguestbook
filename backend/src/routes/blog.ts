// Blog routes: public read + search, admin-only create/update/delete with cover image.
import { Router } from 'express';
import multer from 'multer';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { mkdirSync } from 'node:fs';
import { db, type BlogPostRow } from '../db.js';
import { logger } from '../logger.js';
import { requireAdmin } from '../middleware/auth.js';

export const blogRouter = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadDir = join(__dirname, '..', '..', 'uploads');
mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `blog_${Date.now()}${extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 4 * 1024 * 1024 } });

// GET /api/blog — list posts, optionally filtered by ?q= (title/body search).
blogRouter.get('/', (req, res) => {
  const q = typeof req.query.q === 'string' ? `%${req.query.q}%` : '%';
  const rows = db
    .prepare(
      `SELECT id, title, body, image, author_id, created_at, updated_at
       FROM blog_posts
       WHERE title LIKE ? OR body LIKE ?
       ORDER BY created_at DESC`,
    )
    .all(q, q);
  res.json(rows);
});

// GET /api/blog/:id — read a single post.
blogRouter.get('/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(Number(req.params.id)) as
    | BlogPostRow
    | undefined;
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  res.json(post);
});

// POST /api/blog — create a post (admin only).
blogRouter.post('/', requireAdmin, upload.single('image'), (req, res) => {
  const { title, body } = req.body ?? {};
  if (!title || !body) {
    res.status(400).json({ error: 'title and body are required' });
    return;
  }
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const info = db
    .prepare('INSERT INTO blog_posts (title, body, image, author_id) VALUES (?, ?, ?, ?)')
    .run(title, body, image, req.user!.id);
  res.status(201).json({ id: info.lastInsertRowid, title, body, image });
});

// PUT /api/blog/:id — update a post (admin only).
blogRouter.put('/:id', requireAdmin, upload.single('image'), (req, res) => {
  const id = Number(req.params.id);
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id) as
    | BlogPostRow
    | undefined;
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  const title = req.body?.title ?? post.title;
  const body = req.body?.body ?? post.body;
  const image = req.file ? `/uploads/${req.file.filename}` : post.image;

  db.prepare(
    `UPDATE blog_posts SET title = ?, body = ?, image = ?, updated_at = datetime('now') WHERE id = ?`,
  ).run(title, body, image, id);
  logger.update('blog_post', id, req.user!.pseudo);
  res.json({ id, title, body, image });
});

// DELETE /api/blog/:id — delete a post (admin only).
blogRouter.delete('/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
  logger.remove('blog_post', id, req.user!.pseudo);
  res.json({ ok: true });
});
