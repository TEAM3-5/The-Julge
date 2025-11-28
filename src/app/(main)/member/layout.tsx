import type { PropsWithChildren } from 'react';
import MemberGuard from './MemberGuard';

export default function MemberLayout({ children }: PropsWithChildren) {
  return (
    <MemberGuard>
      <div className="min-h-full py-12 bg-gray-5">{children}</div>;
    </MemberGuard>
  );
}
