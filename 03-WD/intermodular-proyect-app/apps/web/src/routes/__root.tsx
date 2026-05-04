import '../../index.css';
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { AuthState } from '#pods/auth';
import { AppToaster } from '#common/notifications';
import { NotFoundPage } from '#common/components/not-found-page.component';
import { ErrorPage } from '#common/components/error-page.component';

interface RouterContext {
  session: AuthState | null;
}

const queryClient = new QueryClient();

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Intermodular' },
    ],
  }),
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: ({ error, reset }) => (
    <ErrorPage error={error} reset={reset} />
  ),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <AppToaster />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
