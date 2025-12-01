'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { EmptySection } from '@/components/common/EmptySection';
import { ShopCard } from '@/components/owner/ShopCard';
import { PostingList, type PostingItem } from '@/components/owner/PostingList';

import { getUser } from '@/api/users';
import { listNoticesByShop } from '@/api/notices';
import { useAuthStore } from '@/stores/auth';

import type { Shop } from '@/types/shop';
import type { Notice, NoticeListResponse } from '@/types/notice';
import type { UserDetailResponse } from '@/types/user';

/**
 * 화면에서 사용할 뷰 상태
 * loading          : API 호출 중
 * noShop           : 가게 등록이 안된 상태
 * shopNoPosting    : 가게는 있지만 등록한 공고가 없는 상태
 * full             : 가게 + 공고 모두 있는 상태
 * error            : API 에러 발생
 */
type ViewMode = 'loading' | 'noShop' | 'shopNoPosting' | 'full' | 'error';

// ---------------- 타입 가드 ---------------- //

function isUserDetailResponse(data: unknown): data is UserDetailResponse {
  if (!data || typeof data !== 'object') return false;

  const obj = data as { item?: unknown };
  if (!obj.item || typeof obj.item !== 'object') return false;

  const item = obj.item as {
    id?: unknown;
    email?: unknown;
    type?: unknown;
    shop?: { item?: unknown } | null;
  };

  const isString = (v: unknown) => typeof v === 'string';

  return isString(item.id) && isString(item.email);
}

// 공고 목록 응답 타입 가드
function isNoticeListResponse(data: unknown): data is NoticeListResponse {
  if (!data || typeof data !== 'object') return false;

  const obj = data as { items?: unknown };
  if (!Array.isArray(obj.items)) return false;

  return obj.items.every((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    const e = entry as { item?: unknown };
    if (!e.item || typeof e.item !== 'object') return false;

    const notice = e.item as { id?: unknown; startsAt?: unknown };
    return typeof notice.id === 'string' && typeof notice.startsAt === 'string';
  });
}

// ---------------- 헬퍼 함수 ---------------- //

function formatDateTimeShort(iso: string) {
  try {
    return new Date(iso).toISOString().slice(0, 16).replace('T', ' ');
  } catch {
    return iso;
  }
}

// Notice + Shop → PostingItem 으로 매핑
function mapNoticeToPostingItem(notice: Notice, shop: Shop): PostingItem {
  const status: PostingItem['status'] = notice.closed ? 'inactive' : 'active';

  let wageBadgeText: string | undefined;
  if (shop.originalHourlyPay > 0) {
    const diffRatio = (notice.hourlyPay / shop.originalHourlyPay - 1) * 100;
    const rounded = Math.round(diffRatio);
    if (rounded > 0) {
      wageBadgeText = `기존 시급보다 ${rounded}%`;
    }
  }

  const scheduleText = `${formatDateTimeShort(notice.startsAt)} (${notice.workhour}시간)`;

  const fullAddress = shop.address2 ? `${shop.address1} ${shop.address2}` : shop.address1;

  return {
    id: notice.id,
    status,
    title: shop.name,
    scheduleText,
    locationText: fullAddress,
    wage: notice.hourlyPay,
    wageBadgeText,
    thumbnailUrl: shop.imageUrl,
  };
}

// ---------------- 페이지 컴포넌트 ---------------- //

export default function ShopDetailPage() {
  const router = useRouter();

  // URL 파라미터에서 shopId 읽기 (App Router 클라이언트 전용 훅)
  const params = useParams() as { shopId?: string | string[] };
  const rawShopId = params?.shopId;
  const shopId = typeof rawShopId === 'string' ? rawShopId : (rawShopId?.[0] ?? '');

  // 로그인 유저 id
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? '';

  const [viewMode, setViewMode] = useState<ViewMode>('loading');
  const [shop, setShop] = useState<Shop | null>(null);
  const [posts, setPosts] = useState<PostingItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    if (!shopId) {
      setErrorMessage('가게 정보가 올바르지 않습니다.');
      setViewMode('error');
      return;
    }

    async function fetchShopAndNotices() {
      try {
        setViewMode('loading');
        setErrorMessage(null);

        // 1) 내 정보 조회
        const userRes = await getUser(userId);
        const userData = userRes.data;

        if (!isUserDetailResponse(userData)) {
          throw new Error('예상치 못한 사용자 응답 형식입니다.');
        }

        const me = userData.item;
        const shopData = (me.shop?.item ?? null) as Shop | null;

        // 가게가 아직 없으면
        if (!shopData) {
          setShop(null);
          setPosts([]);
          setViewMode('noShop');
          return;
        }

        // URL 의 shopId 와 실제 내 가게 id 가 다르면 URL 교정
        if (shopData.id !== shopId) {
          console.warn('URL shopId와 내 가게 id가 다릅니다.', {
            urlShopId: shopId,
            myShopId: shopData.id,
          });
          router.replace(`/owner/shops/${shopData.id}`);
          return;
        }

        setShop(shopData);

        // 2) 가게 공고 목록 조회
        const noticeRes = await listNoticesByShop(shopId);
        const noticesData = noticeRes.data;

        if (!isNoticeListResponse(noticesData)) {
          throw new Error('예상치 못한 공고 목록 응답 형식입니다.');
        }

        const notices = noticesData.items.map(({ item }) => item as Notice);

        if (notices.length === 0) {
          setPosts([]);
          setViewMode('shopNoPosting');
          return;
        }

        const sortedNotices = [...notices].sort(
          (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
        );

        const mappedPosts: PostingItem[] = sortedNotices.map((notice) =>
          mapNoticeToPostingItem(notice, shopData),
        );

        setPosts(mappedPosts);
        setViewMode('full');
      } catch (error: unknown) {
        console.error(error);

        let msg = '가게 정보를 불러오는 중 오류가 발생했습니다.';

        if (error && typeof error === 'object' && 'response' in error) {
          const e = error as { response?: { data?: { message?: string } } };
          msg = e.response?.data?.message ?? msg;
        } else if (error instanceof Error && error.message) {
          msg = error.message;
        }

        setErrorMessage(msg);
        setViewMode('error');
      }
    }

    fetchShopAndNotices();
  }, [userId, shopId, router]);

  // ---------- 렌더링 분기 ---------- //

  // 로그인 안 된 경우
  if (!userId) {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">내 가게</span>
          <p className="mt-4 tj-body1 text-red-500">
            로그인 정보가 없습니다. 먼저 로그인해 주세요.
          </p>
        </section>
      </main>
    );
  }

  // 로딩
  if (viewMode === 'loading') {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">내 가게</span>
          <p className="mt-4 tj-body1 text-gray-50">가게 정보를 불러오는 중입니다...</p>
        </section>
      </main>
    );
  }

  // 에러
  if (viewMode === 'error') {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <span className="tj-h1 text-gray-black">내 가게</span>
          <p className="mt-4 tj-body1 text-red-500">
            {errorMessage ?? '가게 정보를 불러오는 중 문제가 발생했습니다.'}
          </p>
        </section>
      </main>
    );
  }

  // 가게 자체가 없을 때 (이 URL로 들어왔지만 실제로는 가게 미등록)
  if (viewMode === 'noShop') {
    return (
      <main className="w-full bg-white flex flex-col items-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col">
          <EmptySection
            title="내 가게"
            description="내 가게를 소개하고 공고도 등록해 보세요."
            buttonLabel="가게 등록하기"
            href="/owner/new"
          />
        </section>
      </main>
    );
  }

  // 여기부터는 shop 있는 상태
  if (!shop) return null;

  // 가게는 있지만 공고 없음
  if (viewMode === 'shopNoPosting') {
    return (
      <main className="w-full flex flex-col">
        <div className="w-full bg-white flex justify-center">
          <section className="py-15 w-full max-w-[964px] flex flex-col">
            <ShopCard
              heading="내 가게"
              thumbnailUrl={shop.imageUrl}
              category={shop.category}
              name={shop.name}
              locationText={shop.address1}
              detailLocationText={shop.address2}
              description={shop.description}
              editHref={`/owner/shops/${shop.id}/edit`}
              createPostingHref={`/owner/shops/${shop.id}/postings/new`}
            />
          </section>
        </div>
        <div className="w-full">
          <section className="w-full pt-15 pb-30">
            <EmptySection
              title="등록한 공고"
              description="공고를 등록해 보세요."
              buttonLabel="공고 등록하기"
              href={`/owner/shops/${shop.id}/postings/new`}
              className="gap-8"
            />
          </section>
        </div>
      </main>
    );
  }

  // 가게 + 공고 모두 있음
  if (viewMode === 'full') {
    return (
      <main className="w-full flex flex-col items-center">
        <div className="w-full bg-white flex justify-center">
          <section className="py-15 w-full max-w-[964px] flex flex-col">
            <ShopCard
              heading="내 가게"
              thumbnailUrl={shop.imageUrl}
              category={shop.category}
              name={shop.name}
              locationText={shop.address1}
              detailLocationText={shop.address2}
              description={shop.description}
              editHref={`/owner/shops/${shop.id}/edit`}
              createPostingHref={`/owner/shops/${shop.id}/postings/new`}
            />
          </section>
        </div>
        <div className="w-full max-w-[964px] flex justify-center">
          <section className="w-full pt-15 pb-30">
            <PostingList
              posts={posts}
              onCardClick={(post) => {
                router.push(`/owner/shops/${shop.id}/postings/${post.id}`);
              }}
            />
          </section>
        </div>
      </main>
    );
  }

  return null;
}
