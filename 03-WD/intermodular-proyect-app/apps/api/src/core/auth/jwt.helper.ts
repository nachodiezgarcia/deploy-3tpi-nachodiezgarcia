import { SignJWT, jwtVerify } from 'jose';
import { createEnvReader } from '#core/env';

const getEnv = createEnvReader(process.env);

const accessSecret = new TextEncoder().encode(getEnv('JWT_SECRET'));
const refreshSecret = new TextEncoder().encode(
  getEnv('JWT_REFRESH_SECRET', { fallback: getEnv('JWT_SECRET') }),
);

export const signAccessToken = (payload: { userId: string; role: string }) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(accessSecret);

export const signRefreshToken = (payload: { userId: string }) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(refreshSecret);

export const verifyAccessToken = (token: string) =>
  jwtVerify<{ userId: string; role: string }>(token, accessSecret);

export const verifyRefreshToken = (token: string) =>
  jwtVerify<{ userId: string }>(token, refreshSecret);
