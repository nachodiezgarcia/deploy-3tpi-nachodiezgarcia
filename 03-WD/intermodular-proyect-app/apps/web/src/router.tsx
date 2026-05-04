import { createRouter as createTanstackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import type { AuthState } from '#pods/auth';

interface RouterContext {
  session: AuthState | null;
}

export const getRouter = () =>
  createTanstackRouter({
    routeTree,
    scrollRestoration: true,
    context: { session: null } satisfies RouterContext,
  });

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
