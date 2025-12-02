'use client';

import NoticeDetailClient from '@/components/notice/NoticeDetailClient';
import { useAuth } from '@/contexts/AuthContext';

type PageProps = {
  params: { id: string };
};

export default function Page({ params }: PageProps) {
  const { user } = useAuth();

  // 추후 실제 프로필 API가 생기면 이 부분을 교체
  const profileId = user?.id ?? null;

  return <NoticeDetailClient noticeId={params.id} profileId={profileId} />;
}
