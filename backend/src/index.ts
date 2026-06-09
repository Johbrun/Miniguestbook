// Express application entry point.
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initSchema } from './db.js';
import { loadUser } from './middleware/auth.js';
import { authRouter } from './routes/auth.js';
import { messagesRouter } from './routes/messages.js';
import { blogRouter } from './routes/blog.js';
import { profileRouter } from './routes/profile.js';
import { usersRouter } from './routes/users.js';
import { adminRouter } from './routes/admin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createApp() {
  initSchema();

  const app = express();
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? true,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(loadUser);

  // Serve uploaded files (profile pictures, blog images).
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRouter);
  app.use('/api/messages', messagesRouter);
  app.use('/api/blog', blogRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/admin', adminRouter);

  return app;
}

// Start the server unless we are being imported by tests.
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const port = Number(process.env.PORT ?? 3001);
  const app = createApp();
  app.listen(port, () => {
    console.log('========================================================');
    console.log(`API listening on http://localhost:${port}`);
    console.log(`Have fun 🎉`);
  });
}
