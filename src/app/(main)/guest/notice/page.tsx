'use client';

import { useEffect, useState } from 'react';
import { listNoticesAll, type NoticesQuery } from '@/api/notices';
import type { NoticeListResponse, NoticeListItem } from '@/types/notice';
import { NoticeListSection, type NoticeCard } from '@/components/notice/NoticeListSection';

const PAGE_SIZE = 12;

const normalizeNotice = (item: NoticeListItem): NoticeCard => {
  const notice = item.item;
  const shop = notice.shop?.item;
  const title = notice.description || shop?.name || '공고';
  const scheduleText = notice.startsAt
    ? `${notice.startsAt}${notice.workhour ? ` (${notice.workhour}시간)` : ''}`
    : '날짜/시간 정보 없음';
  const locationText =
    shop?.address1 || shop?.address2 || shop?.address || notice.description || '위치 정보 없음';
  const hourlyPay = Number(notice.hourlyPay) || 0;
  const original = Number(shop?.originalHourlyPay) || 0;
  const wageBadgeText =
    original > 0 && hourlyPay > original
      ? `기존 시급보다 ${Math.round(((hourlyPay - original) / original) * 100)}%`
      : undefined;

  return {
    id: notice.id,
    title,
    scheduleText,
    locationText,
    wage: hourlyPay,
    wageBadgeText,
    thumbnailUrl: shop?.imageUrl || '/images/dotori.svg',
    status: notice.closed ? 'inactive' : 'active',
  };
};

export default function Notice() {
  const [sort, setSort] = useState<string>('time');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [notices, setNotices] = useState<NoticeCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async (params?: NoticesQuery) => {
    try {
      setLoading(true);
      const res = await listNoticesAll(params);
      const data = res.data as NoticeListResponse;
      const items = Array.isArray(data.items) ? data.items : [];
      setNotices(items.map(normalizeNotice));
      const count = typeof data.count === 'number' ? data.count : items.length;
      setTotalPages(Math.max(1, Math.ceil(count / PAGE_SIZE)));
    } catch (err) {
      setError('공고를 불러오지 못했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      sort: sort as NoticesQuery['sort'],
    });
  }, [sort, page]);

  // 정렬 변경 시 페이지를 1로 리셋
  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  return (
    <NoticeListSection
      notices={notices}
      loading={loading}
      error={error}
      sort={sort}
      onSortChange={handleSortChange}
      showFeatured={false}
      showFilterButton={false}
      pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
    />
  );
}
