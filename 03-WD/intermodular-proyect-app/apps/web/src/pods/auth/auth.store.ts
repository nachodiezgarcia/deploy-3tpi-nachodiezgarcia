import { atom } from 'nanostores';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  accessToken: string;
  user: AuthUser;
}

export const $auth = atom<AuthState | null>(null);
