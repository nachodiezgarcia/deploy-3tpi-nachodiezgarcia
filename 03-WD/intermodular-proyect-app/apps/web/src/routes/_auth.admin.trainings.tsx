import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, House, Plus } from 'lucide-react';
import { $auth } from '#pods/auth';
import { getTrainings, TrainingList } from '#pods/training';

export const Route = createFileRoute('/_auth/admin/trainings')({
  beforeLoad: ({ context }) => {
    const session = (context as { session?: { user: { role: string } } })
      .session;
    if (session?.user.role !== 'admin') throw redirect({ to: '/dashboard' });
  },
  component: AdminTrainingsPage,
});

function AdminTrainingsPage() {
  const auth = useStore($auth);

  const {
    data: trainings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => getTrainings(auth!.accessToken),
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
        <span className="text-tsecondary-500">Cursos</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-tbase-500 md:text-[24px]">
          Cursos
        </h1>
        <Link
          to="/admin/training/new"
          className="flex items-center gap-1.5 rounded-lg bg-(--btn-primary-bg) px-3 py-2 text-sm font-semibold text-(--btn-primary-text) transition hover:brightness-95"
        >
          <Plus size={16} />
          <span className="md:hidden">Nuevo</span>
          <span className="hidden md:inline">Nuevo curso</span>
        </Link>
      </div>

      {isLoading && <p className="text-tsecondary-500">Cargando cursos...</p>}
      {isError && (
        <p className="text-terror-500">Error al cargar los cursos.</p>
      )}
      {!isLoading && !isError && <TrainingList trainings={trainings} />}
    </main>
  );
}
