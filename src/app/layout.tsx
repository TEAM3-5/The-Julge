import type { ReactNode } from 'react';
import NavBar from '@/components/common/NavBar';
import { UserRole } from '@/components/common/NavBar';
import './globals.css';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const isLoggedIn = true; // 임시
  const role: UserRole = 'GUEST';

  return (
    <html lang="ko">
      <body>
        <NavBar isLoggedIn={isLoggedIn} role={role} />
        <main>
          <div>{children}</div>
        </main>
        <footer className="flex justify-center">footer 자리입니당</footer>
      </body>
    </html>
  );
}
