import type { PropsWithChildren } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { USER_ROLE } from '@/constants/auth';

export default function MemberLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard allowedRoles={[USER_ROLE.MEMBER]}>
      <div className="min-h-full py-12 bg-gray-5">{children}</div>
    </AuthGuard>
  );
}
