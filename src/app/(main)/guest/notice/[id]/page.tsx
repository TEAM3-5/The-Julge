import NoticeDetailClient from '@/components/notice/NoticeDetailClient';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <NoticeDetailClient noticeId={id} />;
}
