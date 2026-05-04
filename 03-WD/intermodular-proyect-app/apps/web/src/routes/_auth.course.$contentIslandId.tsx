import { createFileRoute } from '@tanstack/react-router';
import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { $auth } from '#pods/auth';
import { getCourseDetail, CourseDetailView } from '#pods/courses';

export const Route = createFileRoute('/_auth/course/$contentIslandId')({
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const auth = useStore($auth);
  const { contentIslandId } = Route.useParams();

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['course', contentIslandId],
    queryFn: () => getCourseDetail(contentIslandId, auth!.accessToken),
    enabled: !!auth,
  });

  if (isLoading) return <p>Cargando curso...</p>;
  if (isError || !course) return <p>Error al cargar el curso.</p>;

  return (
    <main className="flex flex-1 flex-col">
      <CourseDetailView course={course} />
    </main>
  );
}
