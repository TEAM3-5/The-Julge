import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen py-12 bg-gray-5">
      <div className="w-full max-w-[964px] mx-auto flex flex-col gap-y-8">{children}</div>
    </main>
  );
}
