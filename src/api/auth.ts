import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';

type LoginRequest = {
  email: string;
  password: string;
};

export const login = (body: LoginRequest) => http.post(ENDPOINTS.auth.login, body);
