import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-5">
        <main className="min-h-screen py-12">
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-y-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
