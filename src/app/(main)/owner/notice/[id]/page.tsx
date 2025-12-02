import NoticeDetailClient from '@/components/notice/NoticeDetailClient';

type PageProps = {
  params: { id: string };
};

export default function Page({ params }: PageProps) {
  return <NoticeDetailClient noticeId={params.id} />;
}
