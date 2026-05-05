import { createAPIFileRoute } from '@tanstack/react-start/api';

export const APIRoute = createAPIFileRoute('/api/health')({
  GET: () => new Response('OK', { status: 200 }),
});
