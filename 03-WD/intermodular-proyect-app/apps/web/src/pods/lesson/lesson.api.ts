import type { LessonDetail } from './lesson.types';

export const getLesson = (
  lessonId: string,
  accessToken: string,
): Promise<LessonDetail> =>
  fetch(`/api/lesson/${lessonId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((r) => r.json());
