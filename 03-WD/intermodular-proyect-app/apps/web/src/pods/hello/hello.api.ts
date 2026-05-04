import { createServerFn } from '@tanstack/react-start';

export const fetchHello = createServerFn({ method: 'GET' }).handler(
  async () => {
    const res = await fetch('http://localhost:4000/api/hello');
    return res.json() as Promise<{ message: string }>;
  },
);
