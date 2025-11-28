'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function OwnerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, role } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    if (role !== 'owner') {
      router.replace('/posts');
      return;
    }
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn || role !== 'owner') {
    return null;
  }

  return <>{children}</>;
}
