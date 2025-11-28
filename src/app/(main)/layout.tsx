// src/app/(main)/layout.tsx
import type { ReactNode } from 'react';
import NavBar from '@/components/e/NavBar';
import Footer from '@/components/e/Footer';

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <main className="flex flex-1">{children}</main>
      <Footer />
    </div>
  );
}
