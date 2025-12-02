'use client';

import NoticeDetailClient from '@/components/notice/NoticeDetailClient';
import { useAuth } from '@/contexts/AuthContext';

type PageProps = {
  params: { id: string };
};

export default function Page({ params }: PageProps) {
  return <NoticeDetailClient noticeId={params.id} />;
}
