// Minimal smoke test so that `npm test` works out of the box.
// The full security non-regression suite is provided separately by the instructor.
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/index.js';

describe('smoke', () => {
  const app = createApp();

  it('exposes a health endpoint', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('lists guestbook messages', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
