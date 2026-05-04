import type { User, UserDetail, InviteUserInput } from './users.types';

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const getUsers = (accessToken: string): Promise<User[]> =>
  fetch('/api/users', { headers: authHeaders(accessToken) }).then((r) =>
    r.json(),
  );

export const getUserDetail = (
  id: string,
  accessToken: string,
): Promise<UserDetail> =>
  fetch(`/api/users/${id}`, { headers: authHeaders(accessToken) }).then((r) =>
    r.json(),
  );

export const inviteUser = async (
  data: InviteUserInput,
  accessToken: string,
): Promise<{ message: string }> => {
  const r = await fetch('/api/users', {
    method: 'POST',
    headers: {
      ...authHeaders(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = (await r.json()) as { message: string };
  if (!r.ok) throw new Error(body.message ?? 'Error al enviar la invitación');
  return body;
};
