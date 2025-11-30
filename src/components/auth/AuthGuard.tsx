'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/constants/auth';
import { useAuthStore } from '@/stores/auth';

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
  const [isHydrated, setIsHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    return () => {
      unsub();
    };
  }, []);

  const isAllowedRole = role !== 'guest' && allowedRoles.includes(role);
  const fallbackPath = role === 'owner' ? '/owner' : '/member';

  useEffect(() => {
    if (!isHydrated) return;

    if (!isLoggedIn) {
      router.replace(redirectTo);
      return;
    }

    if (!isAllowedRole) {
      router.replace(fallbackPath);
      return;
    }
  }, [isHydrated, isLoggedIn, isAllowedRole, redirectTo, fallbackPath, router]);

  if (!isHydrated || !isLoggedIn || !isAllowedRole) {
    return null;
  }

  return <>{children}</>;
}
