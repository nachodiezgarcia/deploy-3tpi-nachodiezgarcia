import { useId } from 'react';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { InputHTMLAttributes } from 'react';

export interface TextFieldClassNames {
  root?: string;
  label?: string;
  input?: string;
  inputError?: string;
  error?: string;
}

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'name'
  | 'id'
  | 'form'
  | 'aria-invalid'
  | 'aria-describedby'
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  id?: string;
  classNames?: TextFieldClassNames;
}

const DEFAULT_CLASS_NAMES: Required<TextFieldClassNames> = {
  root: 'flex flex-col gap-1.5',
  label: 'text-[13px] font-medium text-tbase-500',
  input:
    'h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-tbase-500 placeholder:text-(--placeholder-text) outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20',
  inputError: 'border-error focus:border-error focus:ring-error/20',
  error: 'text-xs text-terror-500',
};

export function TextField({
  form,
  name,
  label,
  id: idProp,
  classNames,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const errorId = `${inputId}-error`;
  const styles: Required<TextFieldClassNames> = {
    ...DEFAULT_CLASS_NAMES,
    ...classNames,
  };

  return (
    <form.Field name={name}>
      {(field: AnyFieldApi) => {
        const showError =
          (field.state.meta.isBlurred || field.state.meta.isTouched) &&
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
            <input
              {...rest}
              id={inputId}
              name={field.name}
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              aria-invalid={showError || undefined}
              aria-describedby={showError ? errorId : undefined}
              className={[styles.input, showError ? styles.inputError : '']
                .join(' ')
                .trim()}
            />
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
