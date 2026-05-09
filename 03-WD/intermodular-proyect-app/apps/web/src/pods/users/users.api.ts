import type { User, UserDetail, InviteUserInput } from './users.types';
import { BASE_URL } from '#common/api/base-url';

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const getUsers = (accessToken: string): Promise<User[]> =>
  fetch(`${BASE_URL}/api/users`, { headers: authHeaders(accessToken) }).then(
    (r) => r.json(),
  );

export const getUserDetail = (
  id: string,
  accessToken: string,
): Promise<UserDetail> =>
  fetch(`${BASE_URL}/api/users/${id}`, {
    headers: authHeaders(accessToken),
  }).then((r) => r.json());

export const updateUser = async (
  id: string,
  data: { name: string },
  accessToken: string,
): Promise<User> => {
  const r = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'PATCH',
    headers: {
      ...authHeaders(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = (await r.json()) as User | { message: string };
  if (!r.ok)
    throw new Error(
      (body as { message: string }).message ?? 'Error al actualizar',
    );
  return body as User;
};

export const inviteUser = async (
  data: InviteUserInput,
  accessToken: string,
): Promise<{ message: string }> => {
  const r = await fetch(`${BASE_URL}/api/users`, {
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
