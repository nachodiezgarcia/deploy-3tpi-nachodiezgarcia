import type {
  Training,
  TrainingDetail,
  CreateTrainingInput,
  UpdateTrainingInput,
} from './training.types';

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
});

export const getTrainings = (accessToken: string): Promise<Training[]> =>
  fetch('/api/training', { headers: authHeaders(accessToken) }).then((r) =>
    r.json(),
  );

export const getTrainingDetail = (
  id: string,
  accessToken: string,
): Promise<TrainingDetail> =>
  fetch(`/api/training/${id}`, { headers: authHeaders(accessToken) }).then(
    (r) => r.json(),
  );

export const createTraining = (
  data: CreateTrainingInput,
  accessToken: string,
): Promise<{ id: string }> =>
  fetch('/api/training', {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateTraining = (
  id: string,
  data: UpdateTrainingInput,
  accessToken: string,
): Promise<Training> =>
  fetch(`/api/training/${id}`, {
    method: 'PUT',
    headers: authHeaders(accessToken),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const assignTraining = (
  trainingId: string,
  userId: string,
  accessToken: string,
): Promise<{ message: string }> =>
  fetch(`/api/training/${trainingId}/assign`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ userId }),
  }).then((r) => r.json());

export const unassignTraining = (
  trainingId: string,
  userId: string,
  accessToken: string,
): Promise<{ message: string }> =>
  fetch(`/api/training/${trainingId}/unassign`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: JSON.stringify({ userId }),
  }).then((r) => r.json());
