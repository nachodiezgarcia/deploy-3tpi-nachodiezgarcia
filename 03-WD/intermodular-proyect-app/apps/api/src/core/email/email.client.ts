import { Resend } from 'resend';
import { createEnvReader } from '#core/env';

const getEnv = createEnvReader(process.env);

const resend = new Resend(getEnv('RESEND_API_KEY'));
const fromEmail = getEnv('FROM_EMAIL');
const toOverride = getEnv('TO_EMAIL', { fallback: '' });

export const sendInviteEmail = async (
  to: string,
  name: string,
  code: string,
  verifyUrl: string,
) => {
  await resend.emails.send({
    from: fromEmail,
    to: toOverride || to,
    subject: 'Activa tu cuenta — Proyecto Integrado DAW',
    html: `
      <h2>Hola ${name} 👋</h2>
      <p>Has sido invitado a <strong>Proyecto Integrado DAW</strong>.</p>
      <p>Tu código de activación es:</p>
      <p style="font-size:36px;font-weight:bold;letter-spacing:10px;margin:16px 0">${code}</p>
      <p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#c9d600;color:#1f2316;font-weight:bold;border-radius:8px;text-decoration:none">
          Activar cuenta
        </a>
      </p>
      <p style="color:#666;font-size:13px">El enlace expira en 48 horas.</p>
    `,
  });
};
