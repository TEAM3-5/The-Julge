import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';

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

type ParsedAuth = {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'owner' | 'member';
    name?: string;
  };
};

export const login = async (body: LoginRequest) => {
  const res = await http.post<LoginResponse>(ENDPOINTS.auth.login, body);
  return res.data;
};

// login 응답에서 토큰/유저 정보를 추출하는 헬퍼
export const parseLoginResponse = (data?: LoginResponse): ParsedAuth | null => {
  const token = data?.item?.token;
  const user = data?.item?.user?.item;

  if (!token || !user) return null;

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.type === 'employer' ? 'owner' : 'member',
      name: user.name,
    },
  };
};
