import type { StudentCourse, CourseDetail } from './courses.types';

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const getStudentCourses = (
  accessToken: string,
): Promise<StudentCourse[]> =>
  fetch('/api/student-courses', { headers: authHeaders(accessToken) }).then(
    (r) => r.json(),
  );

export const getCourseDetail = (
  contentIslandId: string,
  accessToken: string,
): Promise<CourseDetail> =>
  fetch(`/api/student-courses/${contentIslandId}`, {
    headers: authHeaders(accessToken),
  }).then((r) => r.json());
