import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { $auth } from '#pods/auth';
import { inviteUser, InviteUserForm, CourseSelectGrid } from '#pods/users';
import type { InviteUserInput } from '#pods/users';
import { getTrainings } from '#pods/training';

export const Route = createFileRoute('/_auth/admin/user/new')({
  beforeLoad: ({ context }) => {
    const session = (context as { session?: { user: { role: string } } })
      .session;
    if (session?.user.role !== 'admin') throw redirect({ to: '/dashboard' });
  },
  component: NewUserPage,
});

function NewUserPage() {
  const auth = useStore($auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: trainings = [], isLoading: trainingsLoading } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => getTrainings(auth!.accessToken),
    enabled: !!auth,
  });

  const toggleTraining = (trainingId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(trainingId)) next.delete(trainingId);
      else next.add(trainingId);
      return next;
    });
  };

  const handleInvite = async (
    data: Omit<InviteUserInput, 'coursesToAssign'>,
  ) => {
    const coursesToAssign = trainings
      .filter((t) => selectedIds.has(t.id))
      .map((t) => ({
        contentIslandId: t.contentIslandId,
        name_course: t.name_course,
      }));

    await inviteUser({ ...data, coursesToAssign }, auth!.accessToken);
    await queryClient.invalidateQueries({ queryKey: ['users'] });
    navigate({ to: '/admin/users' });
  };

  return (
    <main className="flex flex-1 flex-col items-center gap-5 px-4 py-6 md:px-10 md:py-8">
      <InviteUserForm onSubmit={handleInvite} />
      <CourseSelectGrid
        trainings={trainings}
        selected={selectedIds}
        onToggle={toggleTraining}
        isLoading={trainingsLoading}
      />
    </main>
  );
}
