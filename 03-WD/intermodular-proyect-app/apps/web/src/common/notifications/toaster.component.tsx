import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex items-center gap-2 rounded-lg shadow-md px-4 py-3 text-sm font-semibold min-w-80',
          success: 'bg-(--color-success) text-(--color-text-success)',
          error: 'bg-(--color-error) text-(--color-text-error)',
          info: 'bg-(--color-info) text-(--color-text-info)',
          warning: 'bg-(--color-warning) text-(--color-text-warning)',
          closeButton:
            'absolute top-1.5 right-1.5 opacity-50 hover:opacity-100 cursor-pointer transition-opacity',
        },
      }}
    />
  );
}
