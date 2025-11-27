import type { PropsWithChildren } from 'react';

export default function OwnerLayout({ children }: PropsWithChildren) {
  return <div className="min-h-full py-12 bg-gray-5">{children}</div>;
}
