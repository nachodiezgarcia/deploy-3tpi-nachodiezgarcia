import { Hono } from 'hono';
import { authMiddleware } from '#core/middleware';
import type { HonoVariables } from '#core/middleware';
import { contentIslandClient } from '#core/content-island';
import type { LessonCI } from '#core/content-island';

export const lessonRoute = new Hono<{ Variables: HonoVariables }>();

lessonRoute.use('/lesson/*', authMiddleware);

lessonRoute.get('/lesson/:id', async (context) => {
  const id = context.req.param('id');

  try {
    const lesson = await contentIslandClient.getContent<LessonCI>({
      id,
      includeRelatedContent: true,
    });
    return context.json({
      id: lesson.id,
      name: lesson.name,
      description: lesson.description,
      video: lesson.video?.url ?? null,
      time: lesson.time,
      view: lesson.view ?? '',
      lastUpdate: lesson.lastUpdate ?? null,
    });
  } catch {
    return context.json({ message: 'Lesson not found' }, 404);
  }
});
