import { serve } from '@hono/node-server';
import { createEnvReader } from '#core/env';
import { connectDb } from '#core/db';
import { app } from '#core/server';

const getEnv = createEnvReader(process.env);
const port = getEnv('PORT', { fallback: 4000, parse: Number });

await connectDb();

serve({ fetch: app.fetch, port }, () => {
  console.log(`API running on http://localhost:${port}`);
});
