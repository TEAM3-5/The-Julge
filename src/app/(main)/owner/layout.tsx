import type { PropsWithChildren } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { USER_ROLE } from '@/constants/auth';

export default function OwnerLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard allowedRoles={[USER_ROLE.OWNER]}>
      <div className="min-h-screen w-full bg-gray-5 flex justify-center">
        {children}
      </div>
    </AuthGuard>
  );
}
