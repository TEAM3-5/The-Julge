'use client';

import { createContext, useContext, type ReactNode, useEffect } from 'react'; // ✅ useEffect 추가
import { useAuthStore, type AuthState } from '@/stores/auth';
import { setAuthToken } from '@/lib/api'; // ✅ 추가

type AuthContextValue = {
  user: AuthState['user'];
  token: AuthState['token'];
  isLoggedIn: boolean;
  role: 'owner' | 'member' | 'guest';
  setAuth: AuthState['setAuth'];
  clearAuth: AuthState['clearAuth'];
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, token, setAuth, clearAuth } = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    setAuth: state.setAuth,
    clearAuth: state.clearAuth,
  }));

  const isLoggedIn = !!user;
  const role: AuthContextValue['role'] = user?.role ?? 'guest';

  useEffect(() => {
    setAuthToken(token ?? null);
  }, [token]);

  const value: AuthContextValue = {
    user,
    token,
    isLoggedIn,
    role,
    setAuth,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return ctx;
}
