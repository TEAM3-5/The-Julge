'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { listNoticesAll, type NoticesQuery } from '@/api/notices';
import type { NoticeListResponse, NoticeListItem } from '@/types/notice';
import { NoticeListSection, type NoticeCard } from '@/components/notice/NoticeListSection';
import { AREAS } from '@/constants/areas';
import { useSearchParams } from 'next/navigation';

const formatStartsAt = (startsAt?: string, workhour?: number) => {
  if (!startsAt) return '날짜/시간 정보 없음';
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return '날짜/시간 정보 없음';
  const dateText = date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return workhour ? `${dateText} (${workhour}시간)` : dateText;
};

const normalizeNotice = (item: NoticeListItem): NoticeCard => {
  const notice = item.item;
  const shop = notice.shop?.item;
  const title = notice.description || shop?.name || '공고';
  const shopAddress = shop?.address1;
  const shopId = shop?.id ? String(shop.id) : undefined;
  const scheduleText = formatStartsAt(notice.startsAt, notice.workhour);
  const locationText =
    shop?.address1 || shop?.address2 || shop?.address || notice.description || '위치 정보 없음';
  const hourlyPay = Number(notice.hourlyPay) || 0;
  const original = Number(shop?.originalHourlyPay) || 0;
  const wageBadgeText =
    original > 0 && hourlyPay > original
      ? `시급 ${Math.round(((hourlyPay - original) / original) * 100)}%`
      : undefined;

  return {
    id: notice.id,
    title,
    shopAddress,
    shopId,
    startsAt: notice.startsAt,
    scheduleText,
    locationText,
    wage: hourlyPay,
    wageBadgeText,
    thumbnailUrl: shop?.imageUrl || '/images/dotori.svg',
    status: notice.closed ? 'inactive' : 'active',
  };
};

export default function GuestNoticeClient() {
  const [sort, setSort] = useState<string>('time');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [notices, setNotices] = useState<NoticeCard[]>([]);
  const [featuredNotices, setFeaturedNotices] = useState<NoticeCard[]>([]);
  const [filters, setFilters] = useState({
    addresses: [] as string[],
    startsAt: '',
    hourlyPayGte: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';

  const fetchNotices = useCallback(
    async (params?: NoticesQuery) => {
      try {
        setLoading(true);
        const res = await listNoticesAll(params);
        const data = res.data as NoticeListResponse;
        const items = Array.isArray(data.items) ? data.items : [];
        const cards = items.map(normalizeNotice);

        if (sort === 'shop') {
          cards.sort((a, b) => a.title.localeCompare(b.title, 'ko', { sensitivity: 'base' }));
        }

        const count = typeof data.count === 'number' ? data.count : items.length;
        const size = params?.limit ?? pageSize;
        const totalPagesCalc = Math.max(1, Math.ceil(count / size));

        setNotices(cards);
        setTotalPages(totalPagesCalc);

        return { cards, totalPages: totalPagesCalc };
      } catch (err) {
        setError('공고를 불러오지 못했습니다.');
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [pageSize, sort],
  );

  // 화면 크기에 따라 페이지당 개수 설정 (모바일 6개, PC 9개)
  useEffect(() => {
    const updatePageSize = () => {
      const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
      const nextSize = mobile ? 6 : 9;
      setPageSize((prev) => {
        if (prev !== nextSize) {
          setPage(1);
        }
        return nextSize;
      });
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  useEffect(() => {
    const params: NoticesQuery = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      sort: sort as NoticesQuery['sort'],
    };

    const selectedLabels = filters.addresses
      .map((value) => AREAS.find((a) => a.value === value)?.label)
      .filter(Boolean) as string[];

    // 주소가 하나일 때만 API에 전달
    if (selectedLabels.length === 1) {
      params.address = selectedLabels[0];
    }
    if (filters.startsAt) {
      const dt = new Date(filters.startsAt);
      if (!Number.isNaN(dt.getTime())) {
        params.startsAtGte = dt.toISOString();
      }
    }
    if (filters.hourlyPayGte) {
      const pay = Number(filters.hourlyPayGte);
      if (!Number.isNaN(pay)) {
        params.hourlyPayGte = pay;
      }
    }

    const run = async () => {
      const res = await fetchNotices(params);
      if (!res) return;

      let filtered = res.cards;

      if (keyword.trim()) {
        const k = keyword.toLowerCase();
        filtered = filtered.filter(
          (card) =>
            card.title.toLowerCase().includes(k) ||
            (card.shopName && card.shopName.toLowerCase().includes(k)),
        );
      }

      if (selectedLabels.length > 0) {
        filtered = filtered.filter((card) =>
          selectedLabels.some(
            (label) => card.shopAddress?.includes(label) || card.locationText.includes(label),
          ),
        );
      }

      setNotices(filtered);
      const count = filtered.length;
      setTotalPages(Math.max(1, Math.ceil(count / pageSize)));
    };

    run();
  }, [sort, page, filters, pageSize, fetchNotices, keyword]);

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  // 추천 공고는 필터와 무관하게 최초 한번 로드
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await listNoticesAll({ limit: 20, sort: 'time' });
        const data = res.data as NoticeListResponse;
        const items = Array.isArray(data.items) ? data.items : [];
        const cards = items.map(normalizeNotice);
        const featured = cards
          .filter((c) => c.shopAddress?.includes('서울시 중구'))
          .sort((a, b) => {
            const aDate = a.startsAt ? new Date(a.startsAt).getTime() : Infinity;
            const bDate = b.startsAt ? new Date(b.startsAt).getTime() : Infinity;
            return aDate - bDate;
          })
          .slice(0, 3);
        setFeaturedNotices(featured);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  return (
    <Suspense fallback={<p className="px-6 py-10 text-gray-50">공고를 불러오는 중...</p>}>
      <NoticeListSection
        notices={notices}
        featuredNotices={featuredNotices}
        loading={loading}
        error={error}
        sort={sort}
        onSortChange={handleSortChange}
        detailPathPrefix="/guest/notice"
        keyword={keyword}
        filterValues={filters}
        onFilterApply={(values) => {
          setFilters(values);
          setPage(1);
        }}
        showFeatured={false}
        showFilterButton
        pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
      />
    </Suspense>
  );
}
