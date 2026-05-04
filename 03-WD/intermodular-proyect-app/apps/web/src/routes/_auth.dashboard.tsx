import { createFileRoute } from '@tanstack/react-router';
import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { $auth } from '#pods/auth';
import { getStudentCourses, CourseList } from '#pods/courses';

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const auth = useStore($auth);

  const {
    data: courses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['student-courses'],
    queryFn: () => getStudentCourses(auth!.accessToken),
    enabled: !!auth,
  });

  if (isLoading)
    return <p className="p-8 text-tsecondary-500">Cargando cursos...</p>;
  if (isError)
    return <p className="p-8 text-terror-500">Error al cargar los cursos.</p>;

  return (
    <main className="flex flex-1 flex-col gap-8 px-5 py-9 md:px-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-[26px] font-bold text-tbase-500 md:text-[30px]">
          Cursos
        </h1>
        <p className="text-[14px] text-tsecondary-500 md:text-[15px]">
          Empieza ya con algunos cursos
        </p>
      </div>
      <CourseList courses={courses} />
    </main>
  );
}
