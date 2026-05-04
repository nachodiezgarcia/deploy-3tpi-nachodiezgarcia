import { createServerFn } from '@tanstack/react-start';
import { getCookie, deleteCookie } from '@tanstack/react-start/server';
import type { AuthState } from './auth.store';

const API = 'http://localhost:4000';

export const refreshSessionFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthState | null> => {
    const refreshToken = getCookie('refresh_token');
    if (!refreshToken) return null;

    const res = await fetch(`${API}/api/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `refresh_token=${refreshToken}` },
    });

    if (!res.ok) return null;
    return res.json() as Promise<AuthState>;
  },
);

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie('refresh_token', { path: '/' });
});
