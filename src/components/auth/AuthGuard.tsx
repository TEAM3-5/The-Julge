'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/constants/auth';
import { useAuthStore } from '@/stores/auth';

type PersistStore = {
  hasHydrated?: () => boolean;
  onFinishHydration?: (cb: () => void) => (() => void) | void;
};

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

  const persist =
    (useAuthStore as typeof useAuthStore & { persist?: PersistStore }).persist;

  //  초기값을 무조건 false 로 두고, 실제 hydration 이 끝난 뒤에만 true 로 변경
  //  (초기 렌더에서 hasHydrated() 가 true 라고 나와도, useAuth 쪽 state 가
  //  아직 반영 안 된 타이밍일 수 있어서 /login 으로 잘못 redirect 되는 현상 방지)
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    // persist 가 없으면 바로 hydrated 처리
    if (!persist) {
      setIsHydrated(true);
      return;
    }

    // onFinishHydration 으로 hydration 완료 시점에 true 설정
    const unsub = persist.onFinishHydration?.(() => {
      setIsHydrated(true);
    });

    // 이미 hydration 이 끝난 상태라면 바로 true 로 한 번 더 보정
    if (persist.hasHydrated?.()) {
      setIsHydrated(true);
    }

    return () => {
      unsub?.();
    };
  }, [persist]);

  const isAllowedRole = role !== 'guest' && allowedRoles.includes(role);
  const fallbackPath = role === 'owner' ? '/owner' : '/member';

  useEffect(() => {
    // hydration 이 끝나기 전에는 어떤 redirect 도 하지 않음
    if (!isHydrated) return;

    // 로그인 안 되어 있으면 → 로그인 페이지로만 이동 (여기서 로그인 UI 를 그리지는 않음)
    if (!isLoggedIn) {
      router.replace(redirectTo);
      return;
    }

    // 권한 안 맞으면 → fallbackPath 로 이동
    if (!isAllowedRole) {
      router.replace(fallbackPath);
      return;
    }
  }, [isHydrated, isLoggedIn, isAllowedRole, redirectTo, fallbackPath, router]);

  //  "hydration 끝 + 로그인 완료 + 권한 OK" 인 경우에만 children 렌더
  //  그 외에는 null 렌더 → /login 페이지로 이동하는 동안 owner 화면에서
  //  로그인 컴포넌트가 잠깐 보이는 현상 제거
  if (!isHydrated || !isLoggedIn || !isAllowedRole) {
    return null;
  }

  return <>{children}</>;
}