import type { LoginResponse } from '@/types/auth';

interface LoginParams {
  email: string;
  password: string;
}

export async function loginApi({ email, password }: LoginParams): Promise<LoginResponse> {
  const res = await fetch('/api/0-1/the-julge/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('로그인 실패');
  }

  const data = await res.json();

  return {
    token: data.item.token,
    user: {
      id: data.item.user.item.id,
      email: data.item.user.item.email,
      type: data.item.user.item.type,
    },
  };
}
