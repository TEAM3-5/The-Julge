import { Suspense } from 'react';
import GuestNoticeClient from './GuestNoticeClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<p className="px-6 py-10 text-gray-50">공고를 불러오는 중...</p>}>
      <GuestNoticeClient />
    </Suspense>
  );
}
