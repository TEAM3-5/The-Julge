import type { PropsWithChildren } from 'react';

export default function OwnerLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-full w-full bg-gray-5 flex justify-center items-start">
      <div className="w-full max-w-[964] flex justify-center items-center">{children}</div>
    </div>
  );
}
