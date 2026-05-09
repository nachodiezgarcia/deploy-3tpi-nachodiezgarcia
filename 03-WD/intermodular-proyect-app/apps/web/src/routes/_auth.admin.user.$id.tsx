import { createFileRoute, redirect } from '@tanstack/react-router';
import { useStore } from '@nanostores/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { $auth } from '#pods/auth';
import {
  getUserDetail,
  updateUser,
  UserDetailView,
  CourseAssignGrid,
} from '#pods/users';
import { getTrainings, assignTraining, unassignTraining } from '#pods/training';

export const Route = createFileRoute('/_auth/admin/user/$id')({
  beforeLoad: ({ context }) => {
    const session = (context as { session?: { user: { role: string } } })
      .session;
    if (session?.user.role !== 'admin') throw redirect({ to: '/dashboard' });
  },
  component: AdminUserDetailPage,
});

function AdminUserDetailPage() {
  const auth = useStore($auth);
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserDetail(id, auth!.accessToken),
    enabled: !!auth,
  });

  const { data: trainings = [] } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => getTrainings(auth!.accessToken),
    enabled: !!auth,
  });

  const handleAssign = async (trainingId: string) => {
    await assignTraining(trainingId, id, auth!.accessToken);
    await queryClient.invalidateQueries({ queryKey: ['user', id] });
  };

  const handleUnassign = async (trainingId: string) => {
    await unassignTraining(trainingId, id, auth!.accessToken);
    await queryClient.invalidateQueries({ queryKey: ['user', id] });
  };

  const handleUpdateUser = async (name: string) => {
    await updateUser(id, { name }, auth!.accessToken);
    await queryClient.invalidateQueries({ queryKey: ['user', id] });
  };

  if (userLoading)
    return <p className="p-8 text-tsecondary-500">Cargando usuario...</p>;
  if (userError || !user)
    return <p className="p-8 text-terror-500">Error al cargar el usuario.</p>;

  return (
    <main className="flex flex-1 flex-col items-center gap-5 px-4 py-6 md:px-10 md:py-8">
      <UserDetailView user={user} onUpdate={handleUpdateUser} />
      <CourseAssignGrid
        trainings={trainings}
        assignedContentIslandIds={user.activeTrainings.map(
          (t) => t.contentIslandId,
        )}
        onAssign={handleAssign}
        onUnassign={handleUnassign}
      />
    </main>
  );
}
