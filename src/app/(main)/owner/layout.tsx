import type { PropsWithChildren } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { USER_ROLE } from '@/constants/auth';

export default function OwnerLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard allowedRoles={[USER_ROLE.OWNER]}>
      <div className="h-full w-full bg-gray-5 flex justify-center items-center">
        <div className="w-full flex justify-center items-center ">{children}</div>
      </div>
    </AuthGuard>
  );
}
