import type { ReactNode } from 'react';
import NavBar from '@/components/common/NavBar';
import './globals.css';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const isLoggedIn = true; // 임시
  const role: 'OWNER' | 'WORKER' | null = 'WORKER';

  return (
    <html lang="ko">
      <body>
        <NavBar isLoggedIn={isLoggedIn} role={role} />
        <main>
          <div>{children}</div>
        </main>
      </body>
    </html>
  );
}
