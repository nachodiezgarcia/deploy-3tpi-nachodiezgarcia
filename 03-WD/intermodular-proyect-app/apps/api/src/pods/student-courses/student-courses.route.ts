import { Hono } from 'hono';
import { authMiddleware } from '#core/middleware';
import type { HonoVariables } from '#core/middleware';
import { contentIslandClient } from '#core/content-island';
import type { CourseCI } from '#core/content-island';
import {
  findUserWithTrainings,
  countStudentsByCourse,
} from './student-courses.model';

export const studentCoursesRoute = new Hono<{ Variables: HonoVariables }>();

studentCoursesRoute.use('/student-courses/*', authMiddleware);

studentCoursesRoute.get('/student-courses', async (context) => {
  const userId = context.get('userId');

  const user = await findUserWithTrainings(userId);
  if (!user) return context.json({ message: 'User not found' }, 404);

  if (user.activeTrainings.length === 0) return context.json([]);

  const ids = user.activeTrainings.map((t) => t.contentIslandId);

  let ciCourses: CourseCI[] = [];
  try {
    ciCourses = await contentIslandClient.getContentList<CourseCI>({
      id: { in: ids },
    });
  } catch {
    ciCourses = [];
  }

  const ciMap = new Map(ciCourses.map((c) => [c.id, c]));

  const courses = user.activeTrainings.map((training) => {
    const ci = ciMap.get(training.contentIslandId);
    return {
      contentIslandId: training.contentIslandId,
      name_course: training.name_course,
      ciName: ci?.name ?? null,
      ciShortDescription: ci?.shortDescription ?? null,
      ciDescription: ci?.description ?? null,
      ciImage: ci?.image?.url ?? null,
    };
  });

  return context.json(courses);
});

studentCoursesRoute.get(
  '/student-courses/:contentIslandId',
  async (context) => {
    const userId = context.get('userId');
    const contentIslandId = context.req.param('contentIslandId');

    const user = await findUserWithTrainings(userId);
    if (!user) return context.json({ message: 'User not found' }, 404);

    const enrolled = user.activeTrainings.some(
      (t) => t.contentIslandId === contentIslandId,
    );
    if (!enrolled)
      return context.json({ message: 'Not enrolled in this course' }, 403);

    try {
      const [course, studentsCount] = await Promise.all([
        contentIslandClient.getContent<CourseCI>({
          id: contentIslandId,
          includeRelatedContent: true,
        }),
        countStudentsByCourse(contentIslandId),
      ]);
      return context.json({
        id: course.id,
        name: course.name,
        description: course.description,
        shortDescription: course.shortDescription,
        image: course.image?.url ?? null,
        lastUpdate: course.lastUpdate,
        studentsCount,
        lessons: course.lessons ?? [],
      });
    } catch {
      return context.json({ message: 'Course not found' }, 404);
    }
  },
);
