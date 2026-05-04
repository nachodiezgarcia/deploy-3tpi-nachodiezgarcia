import { atom } from 'nanostores';

const STORAGE_KEY = 'theme';
const stored =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY)
    : null;
const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const initial: 'light' | 'dark' =
  stored === 'dark' || stored === 'light'
    ? (stored as 'light' | 'dark')
    : prefersDark
      ? 'dark'
      : 'light';

export const $theme = atom<'light' | 'dark'>(initial);

function applyTheme(mode: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  localStorage.setItem(STORAGE_KEY, mode);
}

if (typeof document !== 'undefined') {
  applyTheme(initial);
  $theme.subscribe(applyTheme);
}

export function toggleTheme() {
  $theme.set($theme.get() === 'light' ? 'dark' : 'light');
}
