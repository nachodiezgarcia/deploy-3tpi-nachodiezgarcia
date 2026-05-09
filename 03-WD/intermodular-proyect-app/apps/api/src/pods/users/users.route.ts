import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '#core/middleware';
import type { HonoVariables } from '#core/middleware';
import { createEnvReader } from '#core/env';
import { sendInviteEmail } from '#core/email';
import {
  findUserByEmail,
  createSignUpUser,
  deleteSignUpUser,
} from '#pods/auth';
import { findAllUsers, findUserById, updateUserById } from './users.model';

const getEnv = createEnvReader(process.env);
const webOrigin = getEnv('WEB_ORIGIN', { fallback: 'http://localhost:3000' });

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const inviteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  rol: z.enum(['student', 'admin']),
  coursesToAssign: z.array(
    z.object({
      contentIslandId: z.string(),
      name_course: z.string(),
    }),
  ),
});

export const usersRoute = new Hono<{ Variables: HonoVariables }>();

const requireAdmin = createMiddleware<{ Variables: HonoVariables }>(
  async (context, next) => {
    if (context.get('userRole') !== 'admin') {
      return context.json({ message: 'Forbidden' }, 403);
    }
    await next();
  },
);

usersRoute.use('/users/*', authMiddleware);
usersRoute.use('/users/*', requireAdmin);
usersRoute.use('/users', authMiddleware);
usersRoute.use('/users', requireAdmin);

usersRoute.post('/users', zValidator('json', inviteSchema), async (context) => {
  const { name, email, rol, coursesToAssign } = context.req.valid('json');

  try {
    const existing = await findUserByEmail(email);
    if (existing) return context.json({ message: 'Email ya registrado' }, 409);

    await deleteSignUpUser(email);

    const verificationCode = generateCode();

    await createSignUpUser({
      email,
      name,
      rol,
      coursesToAssign,
      verificationCode,
      createdAt: new Date(),
      isVerified: false,
    });

    const verifyUrl = `${webOrigin}/verify?email=${encodeURIComponent(email)}`;
    await sendInviteEmail(email, name, verificationCode, verifyUrl);

    return context.json({ message: 'Invitación enviada' }, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno';
    return context.json({ message }, 500);
  }
});

usersRoute.get('/users', async (context) => {
  const docs = await findAllUsers();
  return context.json(
    docs.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      rol: u.rol,
      isActive: u.isActive,
    })),
  );
});

const updateUserSchema = z.object({ name: z.string().min(1) });

usersRoute.patch(
  '/users/:id',
  zValidator('json', updateUserSchema),
  async (context) => {
    const id = context.req.param('id');
    const { name } = context.req.valid('json');
    const doc = await updateUserById(id, { name });
    if (!doc) return context.json({ message: 'User not found' }, 404);
    return context.json({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      rol: doc.rol,
      isActive: doc.isActive,
    });
  },
);

usersRoute.get('/users/:id', async (context) => {
  const id = context.req.param('id');
  const doc = await findUserById(id);
  if (!doc) return context.json({ message: 'User not found' }, 404);

  return context.json({
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    rol: doc.rol,
    isActive: doc.isActive,
    activeTrainings: doc.activeTrainings ?? [],
  });
});
