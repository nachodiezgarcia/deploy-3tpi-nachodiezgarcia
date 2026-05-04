import { createMiddleware } from 'hono/factory';
import { verifyAccessToken } from '#core/auth';

export const authMiddleware = createMiddleware(async (context, next) => {
  const authHeader = context.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return context.json({ message: 'Unauthorized' }, 401);
  }
  const token = authHeader.slice(7);
  try {
    const { payload } = await verifyAccessToken(token);
    context.set('userId', payload.userId);
    context.set('userRole', payload.role);
    await next();
  } catch {
    return context.json({ message: 'Invalid token' }, 401);
  }
});
