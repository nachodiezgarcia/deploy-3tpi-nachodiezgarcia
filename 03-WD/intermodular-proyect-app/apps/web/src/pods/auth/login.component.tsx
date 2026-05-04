import { useRouter } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { TextField } from '#common/components/forms';
import { PasswordField } from '#common/components/forms';
import { notify } from '#common/notifications';
import { $auth } from './auth.store';
import { loginSchema, type LoginFormValues } from './login-form.schema';
import type { AuthUser } from './auth.store';

export function LoginForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: { email: '', password: '' } as LoginFormValues,
    validators: { onBlur: loginSchema, onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
          credentials: 'include',
        });

        if (!res.ok) {
          const body = (await res.json()) as { message?: string };
          notify.error(body.message ?? 'Error al iniciar sesión');
          return;
        }

        const { accessToken, user } = (await res.json()) as {
          accessToken: string;
          user: AuthUser;
        };
        $auth.set({ accessToken, user });

        const to = user.role === 'admin' ? '/admin' : '/dashboard';
        await router.navigate({ to });
      } catch {
        notify.error('Error de red. Inténtalo de nuevo.');
      }
    },
    onSubmitInvalid: () => {
      notify.error('Hay errores en el formulario. Revisa los campos.');
    },
  });

  return (
    <div className="w-full max-w-105 rounded-2xl bg-surface p-10 shadow-[0_8px_32px_0_#1f231620]">
      <form
        id="login-form"
        noValidate
        aria-labelledby="login-title"
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <h1
          id="login-title"
          className="text-center text-[26px] font-bold text-tbase-500"
        >
          Iniciar Sesión
        </h1>

        <div className="flex flex-col gap-4">
          <TextField
            form={form}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="nacho@email.com"
          />

          <PasswordField
            form={form}
            name="password"
            label="Contraseña"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-(--btn-primary-bg) text-[15px] font-semibold text-(--btn-primary-text) transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          )}
        </form.Subscribe>

        <p className="text-center text-[13px] text-(--color-link)">
          <a href="#" className="hover:underline">
            ¿Olvidaste tú contraseña?
          </a>
        </p>
      </form>
    </div>
  );
}
