import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { ChevronRight, House, Plus } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { $auth } from '#pods/auth';
import { getUsers, UserGrid } from '#pods/users';

export const Route = createFileRoute('/_auth/admin/users')({
  beforeLoad: ({ context }) => {
    const session = (context as { session?: { user: { role: string } } })
      .session;
    if (session?.user.role !== 'admin') throw redirect({ to: '/dashboard' });
  },
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const auth = useStore($auth);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(auth!.accessToken),
    enabled: !!auth,
  });

  return (
    <main className="flex flex-1 flex-col gap-5 px-5 py-5 md:px-10 md:py-6">
      <nav className="flex items-center gap-1.5 text-[13px]">
        <House size={14} className="text-tsecondary-500" />
        <ChevronRight size={12} className="text-tsecondary-500" />
        <Link to="/admin" className="text-(--color-link) hover:underline">
          Admin
        </Link>
        <ChevronRight size={12} className="text-tsecondary-500" />
        <span className="text-tsecondary-500">Usuarios</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-tbase-500 md:text-[24px]">
          Usuarios
        </h1>
        <Link
          to="/admin/user/new"
          className="flex items-center gap-1.5 rounded-lg bg-(--btn-primary-bg) px-3 py-2 text-sm font-semibold text-(--btn-primary-text) transition hover:brightness-95"
        >
          <Plus size={16} />
          <span className="md:hidden">Nuevo</span>
          <span className="hidden md:inline">Nuevo usuario</span>
        </Link>
      </div>

      {isLoading && <p className="text-tsecondary-500">Cargando usuarios...</p>}
      {isError && (
        <p className="text-terror-500">Error al cargar los usuarios.</p>
      )}
      {!isLoading && !isError && <UserGrid users={users} />}
    </main>
  );
}
