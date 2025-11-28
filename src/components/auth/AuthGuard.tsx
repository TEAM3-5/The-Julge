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

  const isAllowedRole = role !== 'guest' && allowedRoles.includes(role);
  const fallbackPath = role === 'owner' ? '/owner' : '/member';

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(redirectTo);
      return;
    }

    if (!isAllowedRole) {
      router.replace(fallbackPath);
      return;
    }
  }, [isLoggedIn, isAllowedRole, redirectTo, fallbackPath, router]);

  if (!isLoggedIn || !isAllowedRole) {
    return null;
  }

  return <>{children}</>;
}
