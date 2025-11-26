import type { PropsWithChildren } from 'react';

export default function OwnerLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-full py-12">
      <div className="w-full max-w-[964px] flex flex-col gap-y-8">{children}</div>
    </div>
  );
}
