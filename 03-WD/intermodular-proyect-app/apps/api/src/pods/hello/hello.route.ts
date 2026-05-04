import { Hono } from 'hono';

export const helloRoute = new Hono();

helloRoute.get('/hello', (context) =>
  context.json({ message: 'Hello from Intermodular API' }),
);
