'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/constants/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  allowedRoles,
  redirectTo = '/login',
}: AuthGuardProps) {
  const router = useRouter();
  const { isLoggedIn, role } = useAuth();

  const isAllowedRole = role !== 'guest' && allowedRoles.includes(role as UserRole);

  useEffect(() => {
    // 로그인 안 된 상태 → 로그인 페이지로
    if (!isLoggedIn) {
      router.replace(redirectTo);
      return;
    }

    // role 불일치 → 접근 불가 (원하는 경로로 보내기)
    if (!isAllowedRole) {
      router.replace('/posts');
      return;
    }
  }, [isLoggedIn, isAllowedRole, redirectTo, router]);

  if (!isLoggedIn || !isAllowedRole) {
    return null;
  }

  return <>{children}</>;
}
