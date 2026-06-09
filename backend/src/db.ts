// SQLite access layer using better-sqlite3 (synchronous API).
import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');
mkdirSync(dataDir, { recursive: true });

const dbPath = join(dataDir, 'guestbook.db');

// A single shared connection for the whole process.
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create the schema if it does not exist yet.
export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      pseudo        TEXT NOT NULL UNIQUE,
      email         TEXT NOT NULL UNIQUE,
      firstname     TEXT,
      lastname      TEXT,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'user',
      photo         TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER,
      pseudo     TEXT NOT NULL,
      content    TEXT NOT NULL,
      hidden     INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      body       TEXT NOT NULL,
      image      TEXT,
      author_id  INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (author_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

// Shared row types.
export interface UserRow {
  id: number;
  pseudo: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  password_hash: string;
  role: string;
  photo: string | null;
  created_at: string;
}

export interface MessageRow {
  id: number;
  user_id: number | null;
  pseudo: string;
  content: string;
  hidden: number;
  created_at: string;
}

export interface BlogPostRow {
  id: number;
  title: string;
  body: string;
  image: string | null;
  author_id: number | null;
  created_at: string;
  updated_at: string;
}
