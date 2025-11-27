'use client';

import Image from 'next/image';
import Button from '@/components/common/Button';
import { PostCard } from '@/components/post/postCard';
import { PostCardProps } from '@/components/post/postCard';

type NoticeDetail = {
  id: string;
  title: string;
  wage: number;
  wageBadgeText?: string;
  startsAt: string;
  workhour: number;
  location: string;
  description: string;
  thumbnailUrl: string;
};

const MOCK_NOTICE: NoticeDetail = {
  id: '1',
  title: '도토리 식당',
  wage: 15000,
  wageBadgeText: '기존 시급보다 50%',
  startsAt: '2023.02.01 15:00',
  workhour: 3,
  location: '서울시 중구',
  description:
    '기존 알바 친구가 그만두면서 새로운 친구를 구했는데, 그 사이에 하루가 비네요.\n급해서 시급도 높고 같이 보면 바로 알 수 있어서 친절할게요.',
  thumbnailUrl:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcRJOrTwdt2QZc7F4VKcaG4pB0QOuSiawmJA&s',
};

const RECENT_POSTS: (PostCardProps & { id: string })[] = [
  {
    id: 'r1',
    title: '마감 완료',
    scheduleText: '2023-01-03 15:00-18:00 (3시간)',
    locationText: '서울시 마포구',
    wage: 10000,
    wageBadgeText: '기존 시급보다 30%',
    thumbnailUrl: '/images/dotori.svg',
    status: 'inactive' as const,
    inactiveLabelText: '마감 완료',
  },
  {
    id: 'r2',
    title: '별빛카페',
    scheduleText: '2023-01-04 15:00-18:00 (3시간)',
    locationText: '서울시 마포구',
    wage: 9900,
    thumbnailUrl: '/images/dotori.svg',
    status: 'active' as const,
  },
  {
    id: 'r3',
    title: '커피바다',
    scheduleText: '2023-01-05 15:00-18:00 (3시간)',
    locationText: '서울시 중구',
    wage: 11000,
    wageBadgeText: '기존 시급보다 100%',
    thumbnailUrl: '/images/dotori.svg',
    status: 'active' as const,
  },
  {
    id: 'r4',
    title: '해피버거',
    scheduleText: '2023-01-06 15:00-18:00 (3시간)',
    locationText: '서울시 도봉구',
    wage: 9500,
    thumbnailUrl: '/images/dotori.svg',
    status: 'active' as const,
  },
  {
    id: 'r5',
    title: '지난 공고',
    scheduleText: '2023-01-07 15:00-18:00 (3시간)',
    locationText: '서울시 송파구',
    wage: 10000,
    thumbnailUrl: '/images/dotori.svg',
    status: 'inactive' as const,
  },
  {
    id: 'r6',
    title: '지난 공고',
    scheduleText: '2023-01-08 15:00-18:00 (3시간)',
    locationText: '서울시 성북구',
    wage: 9500,
    wageBadgeText: '기존 시급보다 100%',
    thumbnailUrl: '/images/dotori.svg',
    status: 'inactive' as const,
  },
];

export default function NoticeDetailPage() {
  const notice = MOCK_NOTICE;

  return (
    <div className="w-full max-w-[964px] mx-auto flex flex-col gap-y-30">
      <section>
        <div className="flex flex-col gap-6 px-6">
          <div className="flex flex-col gap-2">
            <span className="tj-body2 text-primary">식당</span>
            <h1 className="tj-h2 text-gray-black">{notice.title}</h1>
          </div>

          <div className="flex flex-col gap-6 rounded-xl border border-gray-20 bg-white p-6 md:flex-row">
            <div className="relative h-[260px] w-full overflow-hidden rounded-xl md:w-[360px]">
              <Image src={notice.thumbnailUrl} alt={notice.title} fill className="object-cover" />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="tj-body2 text-primary">시급</p>
                  <p className="tj-h1 text-gray-black">{notice.wage.toLocaleString()}원</p>
                </div>
                {notice.wageBadgeText && (
                  <span className="tj-body2-bold inline-flex items-center gap-1 rounded-full bg-red-40 px-3 py-2 text-white">
                    {notice.wageBadgeText}
                    <Image src="/icons/icon-arrow-up-bold.png" alt="" width={20} height={20} />
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-50">
                <div className="flex items-center gap-2">
                  <Image src="/icons/icon-clock-primary.png" alt="" width={20} height={20} />
                  <span>
                    {notice.startsAt} ({notice.workhour}시간)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/icons/icon-location-primary.png" alt="" width={20} height={20} />
                  <span>{notice.location}</span>
                </div>
              </div>

              <Button size="medium" className="bg-primary text-white w-full md:w-fit">
                신청하기
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-gray-10 p-8 text-gray-50">
            <h3 className="tj-body1-bold text-gray-black mb-2">공고 설명</h3>
            <p className="whitespace-pre-wrap">{notice.description}</p>
          </div>
        </div>
      </section>

      <section className="pb-15">
        <div className="mx-auto flex max-w-[964px] flex-col gap-6 px-6">
          <h2 className="tj-h2 text-gray-black">최근에 본 공고</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RECENT_POSTS.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
