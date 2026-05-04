import { createClient } from '@content-island/api-client';
import { createEnvReader } from '#core/env';

const getEnv = createEnvReader(process.env);

export const contentIslandClient = createClient({
  accessToken: getEnv('CONTENT_ISLAND_TOKEN'),
});
