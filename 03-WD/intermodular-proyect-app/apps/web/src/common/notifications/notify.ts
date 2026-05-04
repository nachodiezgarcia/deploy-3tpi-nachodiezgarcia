import { toast } from 'sonner';

interface PromiseMessages {
  loading: string;
  success: string;
  error: string | ((err: unknown) => string);
}

export const notify = {
  success: (message: string) => toast.success(message, { duration: 2000 }),
  error: (message: string) => toast.error(message, { duration: 3000 }),
  info: (message: string) => toast.info(message, { duration: 2500 }),
  warning: (message: string) => toast.warning(message, { duration: 2500 }),
  loading: (message: string) => toast.loading(message, { duration: Infinity }),
  promise: <T>(promise: Promise<T>, messages: PromiseMessages) =>
    toast.promise(promise, { ...messages, duration: 2000 }),
};
