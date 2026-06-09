// Tiny API client around fetch. The session token is kept in localStorage and
// sent as a Bearer header (the backend also accepts a cookie).

export interface User {
  id?: number;
  pseudo: string;
  email?: string;
  role: string;
  photo?: string | null;
}

const TOKEN_KEY = 'mg_token';
const USER_KEY = 'mg_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function setSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

interface ApiOptions {
  method?: string;
  body?: unknown;
  formData?: FormData;
}

export async function api<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(path, {
    method: opts.method ?? 'GET',
    headers,
    body,
    credentials: 'include',
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw Object.assign(new Error(data?.error ?? `Request failed (${res.status})`), {
      status: res.status,
      data,
    });
  }
  return data as T;
}
