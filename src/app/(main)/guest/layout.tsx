import type { PropsWithChildren } from 'react';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-full">
      <div className="w-full mx-auto flex flex-col gap-y-8">{children}</div>
    </div>
  );
}
