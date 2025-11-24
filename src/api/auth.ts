import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (body: LoginRequest) => {
  const res = await http.post(ENDPOINTS.auth.login, body);
  const { accessToken, user } = res.data ?? {};

  // 로그인 성공 시 토큰/유저 상태 반영
  if (accessToken && user) {
    useAuthStore.getState().setAuth(user, accessToken);
  }

  return res.data;
};
