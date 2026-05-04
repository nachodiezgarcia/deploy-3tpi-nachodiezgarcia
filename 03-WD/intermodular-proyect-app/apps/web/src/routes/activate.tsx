import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';
import { $auth } from '#pods/auth';
import type { AuthState } from '#pods/auth';

export const Route = createFileRoute('/activate')({
  validateSearch: (search) => ({
    email: typeof search.email === 'string' ? search.email : '',
    code: typeof search.code === 'string' ? search.code : '',
  }),
  component: ActivatePage,
});

function ActivatePage() {
  const { email, code } = Route.useSearch();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, code, password, passwordConfirm }),
      });
      const body = (await res.json()) as AuthState & { message?: string };
      if (!res.ok) {
        setError(body.message ?? 'Error al activar la cuenta');
        return;
      }
      $auth.set({ accessToken: body.accessToken, user: body.user });
      navigate({ to: body.user.role === 'admin' ? '/admin' : '/dashboard' });
    } catch {
      setError('Error de red. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-svh items-center justify-center px-6"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="w-full max-w-105 rounded-2xl bg-surface p-10 shadow-[0_8px_32px_0_#1f231620]">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-center text-[26px] font-bold text-tbase-500">
              Crea tu contraseña
            </h1>
            <p className="text-center text-[13px] text-tsecondary-500">
              Elige una contraseña segura para tu cuenta
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="a-password"
                className="text-[13px] font-semibold text-tbase-500"
              >
                Contraseña
              </label>
              <input
                id="a-password"
                type="password"
                className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 outline-none transition placeholder:text-(--placeholder-text) focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="a-confirm"
                className="text-[13px] font-semibold text-tbase-500"
              >
                Confirmar contraseña
              </label>
              <input
                id="a-confirm"
                type="password"
                className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 outline-none transition placeholder:text-(--placeholder-text) focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || password.length < 8}
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-(--btn-primary-bg) text-[15px] font-semibold text-(--btn-primary-text) transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Activando...' : 'Activar cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
