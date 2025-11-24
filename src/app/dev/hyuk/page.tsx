'use client';

import type { ReactElement } from 'react';
import Notification from '@/components/Notification'; // index.tsx 자동 인식

export default function HyukPage(): ReactElement {
  return (
    <main className="p-5 space-y-10">
      <div>
        <h1 className="tj-h1">Hyuk Dev Page</h1>
        <p className="tj-body1">/dev/hyuk 개발용 페이지입니다.</p>
      </div>

      <section className="border p-5 rounded-md max-w-[400px]">
        <h2 className="tj-h2 mb-3">Notification 테스트</h2>

        <Notification
          userId="test-user"
          onClose={() => console.log('알림 닫기')}
        />
      </section>
    </main>
  );
}