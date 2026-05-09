import { useId, useState } from 'react';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordFieldClassNames {
  root?: string;
  label?: string;
  inputWrapper?: string;
  input?: string;
  inputError?: string;
  toggle?: string;
  error?: string;
}

export interface PasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'name'
  | 'id'
  | 'type'
  | 'form'
  | 'aria-invalid'
  | 'aria-describedby'
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  id?: string;
  classNames?: PasswordFieldClassNames;
}

const DEFAULT_CLASS_NAMES: Required<PasswordFieldClassNames> = {
  root: 'flex flex-col gap-1.5',
  label: 'text-[13px] font-medium text-tbase-500',
  inputWrapper:
    'flex h-11 w-full items-center rounded-lg border border-border bg-surface px-3.5 transition focus-within:border-(--color-accent) focus-within:ring-2 focus-within:ring-(--color-accent)/20',
  input:
    'h-full min-w-0 flex-1 bg-transparent text-sm text-tbase-500 placeholder:text-(--placeholder-text) outline-none',
  inputError:
    'border-error focus-within:border-error focus-within:ring-error/20',
  toggle:
    'ml-2 shrink-0 text-tsecondary-500 hover:text-tbase-500 transition-colors cursor-pointer',
  error: 'text-xs text-terror-500',
};

export function PasswordField({
  form,
  name,
  label,
  id: idProp,
  classNames,
  ...rest
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const errorId = `${inputId}-error`;
  const [visible, setVisible] = useState(false);
  const styles: Required<PasswordFieldClassNames> = {
    ...DEFAULT_CLASS_NAMES,
    ...classNames,
  };

  return (
    <form.Field name={name}>
      {(field: AnyFieldApi) => {
        const showError =
          (field.state.meta.isBlurred || form.state.submissionAttempts > 0) &&
          field.state.meta.errors.length > 0;
        const errorMessage = showError
          ? String(
              field.state.meta.errors[0]?.message ?? field.state.meta.errors[0],
            )
          : null;

        return (
          <div className={styles.root}>
            <label htmlFor={inputId} className={styles.label}>
              {label}
            </label>
            <div
              className={[
                styles.inputWrapper,
                showError ? styles.inputError : '',
              ]
                .join(' ')
                .trim()}
            >
              <input
                {...rest}
                id={inputId}
                name={field.name}
                type={visible ? 'text' : 'password'}
                value={field.state.value ?? ''}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={() => {
                  field.handleBlur();
                  void field.validate('change');
                }}
                aria-invalid={showError || undefined}
                aria-describedby={showError ? errorId : undefined}
                className={styles.input}
              />
              <button
                type="button"
                aria-label={
                  visible ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                onClick={() => setVisible((v) => !v)}
                className={styles.toggle}
              >
                {visible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errorMessage && (
              <p id={errorId} role="alert" className={styles.error}>
                {errorMessage}
              </p>
            )}
          </div>
        );
      }}
    </form.Field>
  );
}
