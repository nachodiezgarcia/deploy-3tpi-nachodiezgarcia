import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { LogOut, MessageCircle } from 'lucide-react';
import { $auth, refreshSessionFn, logoutFn } from '#pods/auth';
import { AppHeader } from '#common/components/layout';

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const current = $auth.get();
    if (current) return { session: current };

    const session = await refreshSessionFn();
    if (!session) throw redirect({ to: '/login' });

    $auth.set(session);
    return { session };
  },
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const { session } = Route.useRouteContext();

  // On page refresh, TanStack Start dehydrates the beforeLoad result from SSR
  // without re-running it on the client, so $auth stays null. Sync it here
  // (parent renders before children, so child queries see the correct value).
  if (!$auth.get() && session) {
    $auth.set(session);
  }

  const handleLogout = async () => {
    await logoutFn();
    $auth.set(null);
    await navigate({ to: '/login' });
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <AppHeader onLogout={handleLogout} user={session.user} />
      <Outlet />
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          aria-label="Abrir mentor IA"
          onClick={() => navigate({ to: '/mentor-ia' })}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shadow-md transition-transform hover:scale-105 active:scale-95"
          style={{
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-card)',
          }}
        >
          <MessageCircle size={18} strokeWidth={2.2} />
        </button>

        <button
          type="button"
          aria-label="Cerrar sesión"
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-tsecondary-500 shadow-md transition hover:text-tbase-500"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
