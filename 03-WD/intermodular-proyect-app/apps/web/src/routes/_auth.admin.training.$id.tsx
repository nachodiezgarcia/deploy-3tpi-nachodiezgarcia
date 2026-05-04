import { createFileRoute, redirect } from '@tanstack/react-router';
import { useStore } from '@nanostores/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { $auth } from '#pods/auth';
import {
  getTrainingDetail,
  updateTraining,
  assignTraining,
  TrainingDetailView,
} from '#pods/training';
import type { UpdateTrainingInput } from '#pods/training';

export const Route = createFileRoute('/_auth/admin/training/$id')({
  beforeLoad: ({ context }) => {
    const session = (context as { session?: { user: { role: string } } })
      .session;
    if (session?.user.role !== 'admin') throw redirect({ to: '/dashboard' });
  },
  component: TrainingDetailPage,
});

function TrainingDetailPage() {
  const auth = useStore($auth);
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const {
    data: training,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['training', id],
    queryFn: () => getTrainingDetail(id, auth!.accessToken),
    enabled: !!auth,
  });

  const handleUpdate = async (data: UpdateTrainingInput) => {
    await updateTraining(id, data, auth!.accessToken);
    await queryClient.invalidateQueries({ queryKey: ['training', id] });
    await queryClient.invalidateQueries({ queryKey: ['trainings'] });
  };

  const handleAssign = async (userId: string) => {
    await assignTraining(id, userId, auth!.accessToken);
  };

  if (isLoading)
    return <p className="p-8 text-tsecondary-500">Cargando curso...</p>;
  if (isError || !training)
    return <p className="p-8 text-terror-500">Error al cargar el curso.</p>;

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-6 md:px-10 md:py-8">
      <TrainingDetailView
        training={training}
        onUpdate={handleUpdate}
        onAssign={handleAssign}
      />
    </main>
  );
}
