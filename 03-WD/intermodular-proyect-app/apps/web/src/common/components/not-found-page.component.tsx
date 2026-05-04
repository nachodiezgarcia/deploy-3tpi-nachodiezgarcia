import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="relative w-full max-w-3xl">
        <p
          className="pointer-events-none text-center text-[clamp(7rem,22vw,11rem)] font-black leading-none tracking-tighter"
          style={{ color: 'var(--color-accent)', opacity: 0.18 }}
          aria-hidden="true"
        >
          404
        </p>

        <div
          className="relative z-10 flex flex-col items-center gap-10 rounded-2xl border p-8 text-center shadow-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          <span
            className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
            style={{
              background:
                'color-mix(in srgb, var(--color-accent) 18%, transparent)',
              color: 'var(--color-accent-text)',
            }}
          >
            404 · No encontrada
          </span>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-[26px] font-bold text-tbase-500">
              Página no encontrada
            </h1>
            <p className="text-[14px] text-tsecondary-500">
              La página que buscas no existe o fue movida.
            </p>
          </div>

          <Link
            to="/"
            className="flex h-11 w-48 items-center justify-center gap-2 rounded-xl text-[14px] font-semibold transition hover:brightness-95"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
            }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
