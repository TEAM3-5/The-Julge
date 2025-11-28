import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken } from '@/lib/api';

type Role = 'owner' | 'member';

type User = {
  id: string;
  email: string;
  role: Role;
  name?: string;
};

// Zustand 스토어가 돌 때 상태
export type AuthState = {
  user: User | null; // user가 null이면 게스트 상태로
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

// Zustand 스토어
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      // 로그인 성공시
      setAuth: (user, token) => {
        set({ user, token });
        setAuthToken(token); // 로그인 직후 axios 헤더 설정
      },

      // 로그아웃시
      clearAuth: () => {
        set({ user: null, token: null });
        setAuthToken(null); // 헤더 제거
      },
    }),
    {
      name: 'the-julge-auth', // localStorage key 이름 (원하는 이름으로)
    },
  ),
);
