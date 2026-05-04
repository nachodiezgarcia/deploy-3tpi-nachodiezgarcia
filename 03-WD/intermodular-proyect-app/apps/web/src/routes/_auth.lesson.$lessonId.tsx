import { createFileRoute } from '@tanstack/react-router';
import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { $auth } from '#pods/auth';
import { getLesson, LessonDetailView } from '#pods/lesson';
import { getCourseDetail } from '#pods/courses';

export const Route = createFileRoute('/_auth/lesson/$lessonId')({
  validateSearch: (search: Record<string, unknown>) => ({
    courseId: typeof search.courseId === 'string' ? search.courseId : undefined,
  }),
  component: LessonPage,
});

function LessonPage() {
  const auth = useStore($auth);
  const { lessonId } = Route.useParams();
  const { courseId } = Route.useSearch();

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLesson(lessonId, auth!.accessToken),
    enabled: !!auth,
  });

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseDetail(courseId!, auth!.accessToken),
    enabled: !!auth && !!courseId,
  });

  if (isLoading) return <p>Cargando lección...</p>;
  if (isError || !lesson) return <p>Error al cargar la lección.</p>;

  return (
    <main className="flex flex-1 flex-col">
      <LessonDetailView lesson={lesson} course={course} courseId={courseId} />
    </main>
  );
}
