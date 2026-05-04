import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useStore } from '@nanostores/react';
import { useQueryClient } from '@tanstack/react-query';
import { $auth } from '#pods/auth';
import { createTraining, CreateTrainingForm } from '#pods/training';
import type { CreateTrainingInput } from '#pods/training';

export const Route = createFileRoute('/_auth/admin/training/new')({
  beforeLoad: ({ context }) => {
    const session = (context as { session?: { user: { role: string } } })
      .session;
    if (session?.user.role !== 'admin') throw redirect({ to: '/dashboard' });
  },
  component: NewTrainingPage,
});

function NewTrainingPage() {
  const auth = useStore($auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCreate = async (data: CreateTrainingInput) => {
    const result = await createTraining(data, auth!.accessToken);
    await queryClient.invalidateQueries({ queryKey: ['trainings'] });
    navigate({ to: '/admin/training/$id', params: { id: result.id } });
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-6 md:px-10 md:py-8">
      <CreateTrainingForm onSubmit={handleCreate} />
    </main>
  );
}
