'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function MemberGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, role } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    if (role !== 'member') {
      router.replace('/posts');
      return;
    }
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn || role !== 'member') {
    return null;
  }

  return <>{children}</>;
}
