'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useAuthStore, type AuthState } from '@/stores/auth';

type AuthContextValue = {
  user: AuthState['user'];
  token: AuthState['token'];
  isLoggedIn: boolean;
  role: 'owner' | 'member' | 'guest';
  setAuth: AuthState['setAuth'];
  clearAuth: AuthState['clearAuth'];
};

// Context 기본값은 실제로는 사용하지 않고, 훅에서 체크
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
