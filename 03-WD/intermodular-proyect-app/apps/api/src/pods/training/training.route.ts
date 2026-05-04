import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { authMiddleware } from '#core/middleware';
import type { HonoVariables } from '#core/middleware';
import { contentIslandClient } from '#core/content-island';
import type { CourseCI } from '#core/content-island';
import {
  findAllTrainings,
  findTrainingById,
  createTraining,
  updateTraining,
  findUserById,
  assignTrainingToUser,
  unassignTrainingFromUser,
} from './training.model';
import {
  createTrainingSchema,
  updateTrainingSchema,
  assignTrainingSchema,
} from './training.validations';

export const trainingRoute = new Hono<{ Variables: HonoVariables }>();

const requireAdmin = createMiddleware<{ Variables: HonoVariables }>(
  async (context, next) => {
    if (context.get('userRole') !== 'admin') {
      return context.json({ message: 'Forbidden' }, 403);
    }
    await next();
  },
);

trainingRoute.use('/training/*', authMiddleware);
trainingRoute.use('/training/*', requireAdmin);

trainingRoute.get('/training', async (context) => {
  const docs = await findAllTrainings();

  const enriched = await Promise.all(
    docs.map(async (doc) => {
      try {
        const course = await contentIslandClient.getContent<CourseCI>({
          id: doc.contentIslandId,
        });
        return {
          id: doc._id.toString(),
          name_course: doc.name_course,
          contentIslandId: doc.contentIslandId,
          creationDate: doc.creationDate,
          ciName: course.name,
          ciShortDescription: course.shortDescription ?? null,
          ciDescription: course.description,
          ciImage: course.image?.url ?? null,
        };
      } catch {
        return {
          id: doc._id.toString(),
          name_course: doc.name_course,
          contentIslandId: doc.contentIslandId,
          creationDate: doc.creationDate,
          ciName: null,
          ciShortDescription: null,
          ciDescription: null,
          ciImage: null,
        };
      }
    }),
  );

  return context.json(enriched);
});

trainingRoute.get('/training/:id', async (context) => {
  const id = context.req.param('id');
  const doc = await findTrainingById(id);
  if (!doc) return context.json({ message: 'Training not found' }, 404);

  try {
    const course = await contentIslandClient.getContent<CourseCI>({
      id: doc.contentIslandId,
      includeRelatedContent: true,
    });
    return context.json({
      id: doc._id.toString(),
      name_course: doc.name_course,
      contentIslandId: doc.contentIslandId,
      creationDate: doc.creationDate,
      ci: course,
    });
  } catch {
    return context.json({
      id: doc._id.toString(),
      name_course: doc.name_course,
      contentIslandId: doc.contentIslandId,
      creationDate: doc.creationDate,
      ci: null,
    });
  }
});

trainingRoute.post(
  '/training',
  zValidator('json', createTrainingSchema),
  async (context) => {
    const { name_course, contentIslandId } = context.req.valid('json');

    const result = await createTraining({
      name_course,
      contentIslandId,
      creationDate: new Date(),
    });

    return context.json(
      { id: result.insertedId.toString(), name_course, contentIslandId },
      201,
    );
  },
);

trainingRoute.put(
  '/training/:id',
  zValidator('json', updateTrainingSchema),
  async (context) => {
    const id = context.req.param('id');
    const data = context.req.valid('json');

    const updated = await updateTraining(id, data);
    if (!updated) return context.json({ message: 'Training not found' }, 404);

    return context.json({
      id: updated._id.toString(),
      name_course: updated.name_course,
      contentIslandId: updated.contentIslandId,
    });
  },
);

trainingRoute.post(
  '/training/:id/assign',
  zValidator('json', assignTrainingSchema),
  async (context) => {
    const trainingId = context.req.param('id');
    const { userId } = context.req.valid('json');

    const [training, user] = await Promise.all([
      findTrainingById(trainingId),
      findUserById(userId),
    ]);

    if (!training) return context.json({ message: 'Training not found' }, 404);
    if (!user) return context.json({ message: 'User not found' }, 404);

    const alreadyAssigned = user.activeTrainings.some(
      (t) => t.contentIslandId === training.contentIslandId,
    );
    if (alreadyAssigned)
      return context.json({ message: 'Training already assigned' }, 409);

    await assignTrainingToUser(userId, {
      contentIslandId: training.contentIslandId,
      name_course: training.name_course,
    });

    return context.json({ message: 'Training assigned' });
  },
);

trainingRoute.post(
  '/training/:id/unassign',
  zValidator('json', assignTrainingSchema),
  async (context) => {
    const trainingId = context.req.param('id');
    const { userId } = context.req.valid('json');

    const training = await findTrainingById(trainingId);
    if (!training) return context.json({ message: 'Training not found' }, 404);

    await unassignTrainingFromUser(userId, training.contentIslandId);

    return context.json({ message: 'Training unassigned' });
  },
);
