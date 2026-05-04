import { zValidator } from '@hono/zod-validator';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '#core/auth';
import {
  createUser,
  deleteSignUpUser,
  findSignUpUserByEmail,
  findUserByEmail,
  findUserById,
} from './auth.model';
import { loginSchema, verifySchema, activateSchema } from './auth.validations';

export const authRoute = new Hono();

const COOKIE = 'refresh_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;
const INVITE_EXPIRY_MS = 48 * 60 * 60 * 1000;

const cookieOpts = () => ({
  httpOnly: true as const,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'Strict' as const,
  maxAge: COOKIE_MAX_AGE,
  path: '/',
});

authRoute.post(
  '/auth/verify',
  zValidator('json', verifySchema),
  async (context) => {
    const { email, code } = context.req.valid('json');

    const signUpUser = await findSignUpUserByEmail(email);
    if (!signUpUser)
      return context.json({ message: 'Invitación no encontrada' }, 404);

    if (signUpUser.isVerified)
      return context.json({ message: 'La cuenta ya está activada' }, 409);

    if (signUpUser.verificationCode !== code)
      return context.json({ message: 'Código incorrecto' }, 400);

    const expiresAt = new Date(
      signUpUser.createdAt.getTime() + INVITE_EXPIRY_MS,
    );
    if (new Date() > expiresAt)
      return context.json({ message: 'El código ha caducado' }, 400);

    return context.json({ ok: true });
  },
);

authRoute.post(
  '/auth/activate',
  zValidator('json', activateSchema),
  async (context) => {
    const { email, code, password } = context.req.valid('json');

    const signUpUser = await findSignUpUserByEmail(email);
    if (!signUpUser)
      return context.json({ message: 'Invitación no encontrada' }, 404);

    if (signUpUser.isVerified)
      return context.json({ message: 'La cuenta ya está activada' }, 409);

    if (signUpUser.verificationCode !== code)
      return context.json({ message: 'Código incorrecto' }, 400);

    const expiresAt = new Date(
      signUpUser.createdAt.getTime() + INVITE_EXPIRY_MS,
    );
    if (new Date() > expiresAt)
      return context.json({ message: 'El código ha caducado' }, 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await createUser({
      name: signUpUser.name,
      email: signUpUser.email,
      password: hashedPassword,
      isActive: true,
      rol: signUpUser.rol,
      activeTrainings: signUpUser.coursesToAssign,
    });

    await deleteSignUpUser(email);

    const userId = result.insertedId.toString();
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId, role: signUpUser.rol }),
      signRefreshToken({ userId }),
    ]);

    setCookie(context, COOKIE, refreshToken, cookieOpts());

    return context.json({
      accessToken,
      user: {
        id: userId,
        email: signUpUser.email,
        name: signUpUser.name,
        role: signUpUser.rol,
      },
    });
  },
);

authRoute.post(
  '/auth/login',
  zValidator('json', loginSchema),
  async (context) => {
    const { email, password } = context.req.valid('json');

    const user = await findUserByEmail(email);
    if (!user)
      return context.json({ message: 'Credenciales incorrectas' }, 401);
    if (!user.isActive)
      return context.json({ message: 'Cuenta inactiva' }, 403);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return context.json({ message: 'Credenciales incorrectas' }, 401);

    const userId = user._id.toString();
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId, role: user.rol }),
      signRefreshToken({ userId }),
    ]);

    setCookie(context, COOKIE, refreshToken, cookieOpts());

    return context.json({
      accessToken,
      user: { id: userId, email: user.email, name: user.name, role: user.rol },
    });
  },
);

authRoute.post('/auth/refresh', async (context) => {
  const token = getCookie(context, COOKIE);
  if (!token) return context.json({ message: 'No refresh token' }, 401);

  try {
    const { payload } = await verifyRefreshToken(token);
    const user = await findUserById(payload.userId);
    if (!user) return context.json({ message: 'User not found' }, 404);

    const accessToken = await signAccessToken({
      userId: payload.userId,
      role: user.rol,
    });
    return context.json({
      accessToken,
      user: {
        id: payload.userId,
        email: user.email,
        name: user.name,
        role: user.rol,
      },
    });
  } catch {
    return context.json({ message: 'Invalid refresh token' }, 401);
  }
});

authRoute.post('/auth/logout', (context) => {
  deleteCookie(context, COOKIE, { path: '/' });
  return context.json({ message: 'Logged out' });
});
