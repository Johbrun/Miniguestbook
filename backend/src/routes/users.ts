// Public user lookup route.
import { Router } from 'express';
import { db, type UserRow } from '../db.js';

export const usersRouter = Router();

// GET /api/users/:id — fetch a user's public profile card.
usersRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    id: user.id,
    pseudo: user.pseudo,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role,
    photo: user.photo,
    created_at: user.created_at,
  });
});
