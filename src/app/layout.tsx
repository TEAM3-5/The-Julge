'use client';

import NavBar from '@/components/common/NavBar';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import './globals.css';
import type { ReactNode } from 'react';
import { spoqa } from './fonts';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const router = useRouter();

  const isLoggedIn = true; // 임시 하드코딩. 나중에 전역 상태/쿠키로 대체
  const role: 'OWNER' | 'WORKER' | null = 'WORKER';

  const handleMainPage = () => {
    router.push('/');
  };

  const handleMyPage = () => {
    if (!isLoggedIn) return router.push('/login');
    if (role === 'WORKER') router.push('/worker/profile');
    else router.push('/owner/my-store');
  };

  const handleLogout = () => {
    // 1) 로그아웃 로직
    // 2) 공고 리스트 페이지로 이동
  };

  const handleAlarm = () => {
    // 알림 모달 여는 로직
  };

  const handleSearch = (keyword: string) => {
    // 공고 리스트 페이지로 이동하면서 쿼리 전달
    router.push(`/jobs?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <html lang="ko" className={spoqa.variable}>
      <body>
        <NavBar
          isLoggedIn={isLoggedIn}
          role={role}
          onClickMainPage={handleMainPage}
          onClickMyPage={handleMyPage}
          onClickLogout={handleLogout}
          onClickAlarm={handleAlarm}
          onSearch={handleSearch}
        />
        <main>
          <div>{children}</div>
        </main>
      </body>
    </html>
  );
}
