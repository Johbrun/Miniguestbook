// Authentication context shared across the app.
import { createContext, useContext, useState, type ReactNode } from 'react';
import { api, clearSession, getStoredUser, setSession, type User } from './api';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: (user: User) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser());

  async function login(email: string, password: string) {
    const res = await api<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setSession(res.token, res.user);
    setUser(res.user);
  }

  async function logout() {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } finally {
      clearSession();
      setUser(null);
    }
  }

  function refresh(updated: User) {
    setUser(updated);
    setSession(localStorage.getItem('mg_token') ?? '', updated);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refresh }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
