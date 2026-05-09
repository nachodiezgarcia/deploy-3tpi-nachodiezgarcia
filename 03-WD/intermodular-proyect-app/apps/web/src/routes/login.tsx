import { createFileRoute, redirect } from '@tanstack/react-router';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $theme, toggleTheme } from '#common/theme';
import { $auth, LoginForm, refreshSessionFn } from '#pods/auth';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    if (typeof window !== 'undefined') {
      // Client: use in-memory atom (correctly set/cleared by auth flows)
      if ($auth.get()) throw redirect({ to: '/' });
      return;
    }
    // Server: $auth is a module-level singleton shared across all requests —
    // it retains the previous user's session after logout. Always verify via cookie.
    const session = await refreshSessionFn();
    if (session) throw redirect({ to: '/' });
  },
  component: LoginPage,
});

function LoginPage() {
  const theme = useStore($theme);

  return (
    <div className="flex min-h-svh">
      <aside
        className="relative hidden md:flex md:w-120 md:shrink-0 flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--hero-bg)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute h-80 w-80 rounded-full"
          style={{
            top: '-100px',
            left: '220px',
            background: 'radial-gradient(circle, #c9d60020 0%, #c9d60000 100%)',
          }}
        />

        <div className="relative flex h-15 w-full shrink-0 items-center justify-end px-7">
          <button
            type="button"
            aria-label={
              theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'
            }
            onClick={toggleTheme}
            className="cursor-pointer transition-opacity hover:opacity-80"
          >
            {theme === 'light' ? (
              <Sun size={18} style={{ color: '#c9d60099' }} />
            ) : (
              <Moon size={18} style={{ color: '#c9d60099' }} />
            )}
          </button>
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-5 px-12 pb-20">
          <div
            className="h-0.75 w-10 rounded-[2px]"
            style={{ backgroundColor: '#c9d600' }}
          />

          <h2
            className="whitespace-pre-line text-[38px] font-bold leading-[1.15]"
            style={{ color: '#f4f6f2', width: '360px' }}
          >
            {'Empieza tu\ncamino'}
          </h2>

          <p className="text-base" style={{ color: '#9ea59b' }}>
            Aprende y disfruta
          </p>

          <div className="h-10" />

          <span
            className="text-[13px] font-semibold"
            style={{ color: '#c9d600', letterSpacing: '0.5px' }}
          >
            Proyecto Integrado DAW
          </span>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-12 md:hidden">
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="text-sm font-bold text-tbase-500">Proyecto</span>
            <span className="text-sm font-bold text-tbase-500">Integrado</span>
            <span
              className="text-xs font-semibold"
              style={{ color: '#c9d600' }}
            >
              DAW
            </span>
          </div>
          <button type="button" aria-label="Menú" className="text-tbase-500">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <rect y="5" width="24" height="2" rx="1" fill="currentColor" />
              <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
              <rect y="17" width="24" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
        </header>

        <div
          className="flex flex-1 items-center justify-center px-6 py-10"
          style={{ backgroundColor: 'var(--bg-page)' }}
        >
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
