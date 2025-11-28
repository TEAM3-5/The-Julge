import type { PropsWithChildren } from 'react';
import OwnerGuard from './OwnerGuard';

export default function OwnerLayout({ children }: PropsWithChildren) {
  return (
    <OwnerGuard>
      <div className="h-full w-full bg-gray-5 flex justify-center items-center">
        <div className="w-full flex justify-center items-center ">{children}</div>
      </div>
    </OwnerGuard>
  );
}
