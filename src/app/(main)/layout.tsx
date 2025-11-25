// src/app/(main)/layout.tsx
import type { ReactNode } from 'react';
import NavBar, { UserRole } from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';
import { ToastProvider } from '@/components/toast/toastProvider';

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  const isLoggedIn = false; // 임시
  const role: UserRole = 'OWNER';

  return (
    <div className="min-h-screen flex flex-col">
      <ToastProvider>
        <NavBar isLoggedIn={isLoggedIn} role={role} />
        <main className="flex-1 flex mx-auto">{children}</main>
        <Footer />
      </ToastProvider>
    </div>
  );
}
