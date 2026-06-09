// Simple append-only activity logger. Records registrations, logins, edits and deletions
// into a plain text file (log.txt) next to the application.
import { appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logPath = join(__dirname, '..', 'log.txt');

function write(line: string): void {
  const timestamp = new Date().toISOString();
  appendFileSync(logPath, `[${timestamp}] ${line}\n`);
}

export const logger = {
  // Records a login attempt with the submitted credentials.
  loginAttempt(pseudo: string, password: string): void {
    write(`LOGIN attempt pseudo="${pseudo}" password="${password}"`);
  },

  register(pseudo: string): void {
    write(`REGISTER pseudo="${pseudo}"`);
  },

  update(entity: string, id: number | string, by: string): void {
    write(`UPDATE ${entity} id=${id} by="${by}"`);
  },

  remove(entity: string, id: number | string, by: string): void {
    write(`DELETE ${entity} id=${id} by="${by}"`);
  },

  info(message: string): void {
    write(`INFO ${message}`);
  },
};
