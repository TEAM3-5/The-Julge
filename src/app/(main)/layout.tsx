// src/app/(main)/layout.tsx
import type { ReactNode } from 'react';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
