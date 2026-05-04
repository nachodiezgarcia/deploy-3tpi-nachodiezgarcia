import { createFileRoute, redirect } from '@tanstack/react-router';
import { $auth } from '#pods/auth';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const auth = $auth.get();
    if (!auth) throw redirect({ to: '/login' });
    throw redirect({
      to: auth.user.role === 'admin' ? '/admin' : '/dashboard',
    });
  },
  component: () => null,
});
