import { create } from 'zustand';
import { setAuthToken } from '@/lib/api';

type Role = 'owner' | 'member';

type User = {
  id: string;
  email: string;
  role: Role;
  name?: string;
};

// Zustand 스토어가 돌 때 상태
type AuthState = {
  user: User | null; // user가 null이면 게스트 상태로
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

// Zustand 스토어
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  // 로그인 성공시
  setAuth: (user, token) => {
    // Zustand 상태 업데이트
    set({ user, token });
    // axios 인스턴스 header 토큰 설정
    setAuthToken(token);
  },

  // 로그아웃시
  clearAuth: () => {
    set({ user: null, token: null });
    setAuthToken(null);
  },
}));
