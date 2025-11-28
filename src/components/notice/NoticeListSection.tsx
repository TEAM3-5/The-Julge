'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { SwiperOptions } from 'swiper/types';
import { PostCard } from '@/components/post/postCard';
import Dropdown from '@/components/e/Dropdown';
import Button from '@/components/e/Button';
import { Pagination } from '@/components/pagination/Pagination';

export type NoticeCard = {
  id: string | number;
  title: string;
  scheduleText: string;
  locationText: string;
  wage: number;
  wageBadgeText?: string;
  thumbnailUrl: string;
  status?: 'active' | 'inactive';
};

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

type NoticeListSectionProps = {
  notices: NoticeCard[];
  loading?: boolean;
  error?: string | null;
  sort?: string;
  onSortChange?: (value: string) => void;
  showFeatured?: boolean;
  showFilterButton?: boolean;
  pagination?: PaginationProps;
};

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

const SORT_OPTIONS = [
  { value: 'time', label: '마감임박순' },
  { value: 'pay', label: '시급많은순' },
  { value: 'hour', label: '시간적은순' },
  { value: 'shop', label: '가나다순' },
];

export function NoticeListSection({
  notices,
  loading,
  error,
  sort,
  onSortChange,
  showFeatured = false,
  showFilterButton = false,
  pagination,
}: NoticeListSectionProps) {
  const featured = showFeatured ? notices.slice(0, 4) : [];
  const list = notices;

  return (
    <div className="w-full">
      {/* 맞춤 공고 로그인 돼어(/member 경로) 있거나, 맞춤 공고가 1개 이상일 때 보이게 */}
      {showFeatured && featured.length > 0 && (
        <section className="bg-red-10 py-10 w-full">
          <div className="mx-auto flex max-w-[964px] flex-col gap-6 px-6">
            <h2 className="tj-h2 text-gray-black">맞춤 공고</h2>
            <Swiper
              {...swiperConfig}
              className="w-full custom-swiper"
              style={{
                ['--swiper-theme-color' as string]: '#ff8d72',
                ['--swiper-pagination-color' as string]: '#ff8d72',
                ['--swiper-pagination-bullet-inactive-color' as string]: '#cbc9cf',
                ['--swiper-pagination-bullet-inactive-opacity' as string]: '1',
              }}
            >
              {featured.map((post) => (
                <SwiperSlide key={post.id} className="pb-4">
                  <PostCard status={post.status ?? 'active'} {...post} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      <section className="bg-white py-10">
        <div className="mx-auto flex max-w-[964px] flex-col gap-6 px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h2 className="tj-h2 text-gray-black">전체 공고</h2>
            <div className="flex items-center gap-2">
              {onSortChange && (
                <Dropdown
                  size="compact"
                  options={SORT_OPTIONS}
                  value={sort}
                  onChange={onSortChange}
                />
              )}
              {showFilterButton && (
                <Button size="medium" type="button" className="bg-red-30">
                  상세 필터
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((post) => (
              <PostCard key={post.id} status={post.status ?? 'active'} {...post} />
            ))}
            {!loading && !error && list.length === 0 && (
              <p className="text-sm text-gray-50">표시할 공고가 없습니다.</p>
            )}
          </div>

          {loading && <div className="text-sm text-gray-50">공고를 불러오는 중...</div>}
          {error && <div className="text-sm text-red-40">{error}</div>}

          {pagination && (
            <div className="flex justify-center">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.onPageChange}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
