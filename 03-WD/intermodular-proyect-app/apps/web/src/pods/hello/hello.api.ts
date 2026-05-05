import { createServerFn } from '@tanstack/react-start';

export const fetchHello = createServerFn({ method: 'GET' }).handler(
  async () => {
    const API = process.env['PUBLIC_API_BASE_URL'] ?? 'http://localhost:4000';
    const res = await fetch(`${API}/api/hello`);
    return res.json() as Promise<{ message: string }>;
  },
);
