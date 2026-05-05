import { createFileRoute } from '@tanstack/react-router';
import { MentorIaChat } from '#pods/mentor-ia';

export const Route = createFileRoute('/_auth/mentor-ia')({
  component: MentorIaPage,
});

function MentorIaPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <MentorIaChat />
    </main>
  );
}
