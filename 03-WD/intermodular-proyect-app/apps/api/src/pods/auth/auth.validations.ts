import { z } from 'zod';

export const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const activateSchema = z
  .object({
    email: z.string().email(),
    code: z.string().length(6),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
