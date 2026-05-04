import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';

export const Route = createFileRoute('/verify')({
  validateSearch: (search) => ({
    email: typeof search.email === 'string' ? search.email : '',
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { email: emailParam } = Route.useSearch();
  const navigate = useNavigate();

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const body = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setError(body.message ?? 'Error al verificar el código');
        return;
      }
      navigate({
        to: '/activate',
        search: { email, code },
      });
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
              Activar cuenta
            </h1>
            <p className="text-center text-[13px] text-tsecondary-500">
              Introduce el código de 6 dígitos que recibiste por email
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
                htmlFor="v-email"
                className="text-[13px] font-semibold text-tbase-500"
              >
                Email
              </label>
              <input
                id="v-email"
                type="email"
                className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 outline-none transition placeholder:text-(--placeholder-text) focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="v-code"
                className="text-[13px] font-semibold text-tbase-500"
              >
                Código de verificación
              </label>
              <input
                id="v-code"
                className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-center text-[22px] font-bold tracking-[0.4em] text-tbase-500 outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="000000"
                maxLength={6}
                required
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-(--btn-primary-bg) text-[15px] font-semibold text-(--btn-primary-text) transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Verificando...' : 'Verificar código'}
          </button>
        </form>
      </div>
    </div>
  );
}
