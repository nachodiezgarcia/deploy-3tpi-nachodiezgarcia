import { z } from 'zod';

export const createTrainingSchema = z.object({
  name_course: z.string().min(1),
  contentIslandId: z.string().min(1),
});

export const updateTrainingSchema = z.object({
  name_course: z.string().min(1).optional(),
  contentIslandId: z.string().min(1).optional(),
});

export const assignTrainingSchema = z.object({
  userId: z.string().min(1),
});
