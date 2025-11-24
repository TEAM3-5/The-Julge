import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  item?: {
    token?: string;
    user?: {
      item?: {
        id: string;
        email: string;
        type: 'employer' | 'employee';
        name?: string;
        phone?: string;
        address?: string;
        bio?: string;
      };
      href?: string;
    };
  };
  links?: unknown[];
};

export const login = async (body: LoginRequest) => {
  const res = await http.post<LoginResponse>(ENDPOINTS.auth.login, body);
  const token = res.data?.item?.token;
  const user = res.data?.item?.user?.item;

  // 로그인 성공 시 토큰/유저 상태 반영
  if (token && user) {
    useAuthStore.getState().setAuth(
      {
        id: user.id,
        email: user.email,
        role: user.type === 'employer' ? 'owner' : 'member',
        name: user.name,
      },
      token,
    );
  }

  return res.data;
};
