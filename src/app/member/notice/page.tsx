'use client';

import { useState, useMemo } from 'react';
import { PostCard } from '@/components/post/postCard';
import { Pagination } from '@/components/pagination/Pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { SwiperOptions } from 'swiper/types';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';

type Post = {
  id: number;
  title: string;
  scheduleText: string;
  locationText: string;
  wage: number;
  wageBadgeText?: string;
  thumbnailUrl: string;
  status?: 'active' | 'inactive';
};

const featuredPosts: Post[] = [
  {
    id: 1,
    title: '물방개찐식당',
    scheduleText: '2023-02-31 15:00-18:00 (3시간)',
    locationText: '서울시 마포구',
    wage: 15000,
    wageBadgeText: '기존 시급보다 50%',
    thumbnailUrl: '/images/dotori.svg',
  },
  {
    id: 2,
    title: '맛집책카페',
    scheduleText: '2023-02-12 15:00-18:00 (3시간)',
    locationText: '서울시 영등포구',
    wage: 12000,
    wageBadgeText: '기존 시급보다 20%',
    thumbnailUrl: '/images/dotori.svg',
  },
  {
    id: 3,
    title: '도토리식당',
    scheduleText: '2023-02-05 15:00-18:00 (3시간)',
    locationText: '서울시 중구',
    wage: 10000,
    wageBadgeText: '기존 시급보다 10%',
    thumbnailUrl: '/images/dotori.svg',
  },
  {
    id: 4,
    title: '새우탕집',
    scheduleText: '2023-02-10 15:00-18:00 (3시간)',
    locationText: '서울시 강서구',
    wage: 13000,
    wageBadgeText: '기존 시급보다 30%',
    thumbnailUrl: '/images/dotori.svg',
  },
];

const allPosts: Post[] = [
  {
    id: 5,
    title: '수리 에스프레소 맛집',
    scheduleText: '2023-01-03 15:00-18:00 (3시간)',
    locationText: '서울시 용산구',
    wage: 10000,
    wageBadgeText: '기존 시급보다 30%',
    thumbnailUrl: '/images/dotori.svg',
  },
  {
    id: 6,
    title: '별빛카페',
    scheduleText: '2023-01-04 15:00-18:00 (3시간)',
    locationText: '서울시 동작구',
    wage: 9900,
    thumbnailUrl: '/images/dotori.svg',
  },
  {
    id: 7,
    title: '커피바다',
    scheduleText: '2023-01-05 15:00-18:00 (3시간)',
    locationText: '서울시 중구',
    wage: 11000,
    wageBadgeText: '기존 시급보다 100%',
    thumbnailUrl: '/images/dotori.svg',
  },
  {
    id: 8,
    title: '해피버거',
    scheduleText: '2023-01-06 15:00-18:00 (3시간)',
    locationText: '서울시 종로구',
    wage: 9500,
    thumbnailUrl: '/images/dotori.svg',
    status: 'inactive',
  },
  {
    id: 9,
    title: '정원식당',
    scheduleText: '2023-01-07 15:00-18:00 (3시간)',
    locationText: '서울시 송파구',
    wage: 10000,
    thumbnailUrl: '/images/dotori.svg',
    status: 'inactive',
  },
  {
    id: 10,
    title: '우리동네카페',
    scheduleText: '2023-01-08 15:00-18:00 (3시간)',
    locationText: '서울시 서대문구',
    wage: 9500,
    wageBadgeText: '기존 시급보다 10%',
    thumbnailUrl: '/images/dotori.svg',
    status: 'inactive',
  },
];

const swiperConfig: SwiperOptions = {
  spaceBetween: 14,
  slidesPerView: 1.2,
  loop: true,
  pagination: {
    clickable: true,
  },
  modules: [SwiperPagination],
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 16 },
    900: { slidesPerView: 3, spaceBetween: 20 },
    1200: { slidesPerView: 3, spaceBetween: 24 },
  },
};

export default function Notice() {
  const totalPages = 7;

  const [area, setArea] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<string>('deadline');

  // 실제로는 필터/정렬/페이지네이션 상태를 관리하지만, 여기서는 디자인 데모용 정적 데이터
  const featured = useMemo(() => featuredPosts, []);
  const list = useMemo(() => allPosts, []);

  return (
    <div className="w-full">
      {/* 맞춤 공고 */}
      <section className="bg-red-10 py-10 w-full">
        <div className="mx-auto flex max-w-[964px] flex-col gap-6 px-6">
          <h2 className="tj-h2 text-gray-black">맞춤 공고</h2>
          <Swiper
            {...swiperConfig}
            className="w-full [&_.swiper-pagination-bullet]:bg-gray-30 [&_.swiper-pagination-bullet-active]:bg-red-30 [&_.swiper-pagination]:!static"
          >
            {featured.map((post) => (
              <SwiperSlide key={post.id} className="pb-4">
                <PostCard status={post.status ?? 'active'} size="large" {...post} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 전체 공고 */}
      <section className="bg-white py-10">
        <div className="mx-auto flex max-w-[964px] flex-col gap-6 px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h2 className="tj-h2 text-gray-black">전체 공고</h2>
            <div className="flex items-center gap-2">
              <Dropdown
                size="compact"
                options={[
                  { value: 'deadline', label: '마감임박순' },
                  { value: 'wage', label: '시급많은순' },
                  { value: 'time', label: '시간적은순' },
                  { value: 'alpha', label: '가나다순' },
                ]}
                value={sort}
                onChange={setSort}
              />
              <Button size="medium" type="button" className="bg-red-30">
                상세 필터
              </Button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((post) => (
              <PostCard key={post.id} status={post.status ?? 'active'} size="large" {...post} />
            ))}
          </div>

          <div className="flex justify-center">
            <Pagination currentPage={1} totalPages={totalPages} onPageChange={() => {}} />
          </div>
        </div>
      </section>
    </div>
  );
}
