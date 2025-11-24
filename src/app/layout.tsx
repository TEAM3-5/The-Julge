import type { ReactNode } from 'react';
import NavBar from '@/components/common/NavBar';
import { UserRole } from '@/components/common/NavBar';
import './globals.css';
import { spoqa } from './fonts';
import Footer from '@/components/common/Footer';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const isLoggedIn = false; // 임시
  const role: UserRole = 'OWNER';

  return (
    <html lang="ko" className={spoqa.className}>
      <body className="min-h-screen flex flex-col">
        <NavBar isLoggedIn={isLoggedIn} role={role} />
        <main className="flex-1">
          <div>{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
