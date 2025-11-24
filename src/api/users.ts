import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';

export const createUser = (body: unknown) => http.post(ENDPOINTS.users.create, body);

export const getUser = (userId: string) => http.get(ENDPOINTS.users.detail(userId));

export const updateUser = (userId: string, body: unknown) =>
  http.put(ENDPOINTS.users.detail(userId), body);
