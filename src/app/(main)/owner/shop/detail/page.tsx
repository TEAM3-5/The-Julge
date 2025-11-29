"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EmptySection } from "@/components/common/EmptySection";
import { ShopCard } from "@/components/owner/ShopCard";
import { PostingList, type PostingItem, } from "@/components/owner/PostingList"

import { getUser } from "@/api/users";
import { listNoticesByShop } from "@/api/notices";

/**
 * 화면에서 사용할 뷰 상태
 * loading          : API 호출 중
 * noShop           : 가게 등록이 안된 상태
 * shopNoPosting    : 가게는 있지만 등록한 공고가 없는 상태
 * full             : 가게 + 공고 모두 있는 상태
 * error            : API 에러 발생
 */
type ViewMode = "loading" | "noShop" | "shopNoPosting" | "full" | "error";

// /users/{user_id} 응답에서 필요한 부분 정의
type UserDetailResponse = {
    item: {
        id: string;
        email: string;
        type: "employer" | "employee";
        name?: string;
        phone?: string;
        address?: string;
        bio?: string;
        shop?: {
            item: Shop;
        } | null;
    };
};

// shops 관련 Shop 타입
type Shop = {
    id: string;
    name: string;
    category: string;
    address1: string;
    address2: string;
    description: string;
    imageUrl: string;
    originalHourlyPay: number;
};

// /shops/{shop_id}/notices 공고 단일 item 타입
type Notice = {
    id: string;
    hourlyPay: number;
    startsAt: string;
    workhour: number;
    description: string;
    closed: boolean;
};

// /shops/{shop_id}/notices 응답 타입
type ShopNoticesResponse = {
    offset: number;
    limit: number;
    count: number;
    hasNext: boolean;
    items: {
        item: Notice;
        links: unknown[];
    }[];
};

// 날짜 문구 변환
function formatDateTimeShort(iso: string) {
    return iso.replace("T", " ").replace(/:\d{2}Z$/, "");
}

// Notice + Shop 데이터를 PostingList가 사용하는 PostingItem 형태로 변환
function mapNoticeToPostingItem(notice: Notice, shop: Shop): PostingItem {
    // closed 여부에 따라 카드 status 설정
    const status: PostingItem["status"] = notice.closed ? "inactive" : "active";

    // 기준 시급 대비 공고 시급 차이 계산
    let wageBadgeText: string | undefined;
    if (shop.originalHourlyPay > 0) {
        const diffRatio = (notice.hourlyPay / shop.originalHourlyPay - 1) * 100;
        const rounded = Math.round(diffRatio);

        if (rounded > 0) {
            wageBadgeText = `기존 시급보다 ${rounded}%`;
        } else if (rounded === 0) {
            wageBadgeText = "기존 시급과 동일";
        } else {
            wageBadgeText = `기존 시급보다 ${Math.abs(rounded)}% 낮음`;
        }
    }

    const scheduleText = `${formatDateTimeShort(notice.startsAt)} (${notice.workhour}시간)`;

    return {
        id: notice.id,
        status,
        title: shop.name,
        scheduleText,
        locationText: shop.address1,
        wage: notice.hourlyPay,
        wageBadgeText,
        thumbnailUrl: shop.imageUrl,
    };
}

export default function ShopDetailPage() {
    const router = useRouter();

    // auth store/contex에서 로그인 유저 id 가져오기
    // const userId = useAuthStore((state) => state.user?.id);
    const userId = "로그인 한 유저 Id";

    // 현재 뷰 상태(로딩 / 에러 / 가게 없음 / 가게만 있음 / 가게+공고 있음 )
    const [viewMode, setViewMode] = useState<ViewMode>("loading");

    // 현재 사장님의 가게 정보
    const [shop, setShop] = useState<Shop | null>(null);

    // PostingList에 넘겨줄 공고 카드 데이터 배열
    const [posts, setPosts] = useState<PostingItem[]>([]);

    // 에러 메시지
    const [errorMessage, SetErrorMessage] = useState<string | null>(null);

    /**
     * 마운트 시 / userId 변경 시
     * 1) 내 정보 조회 -> shop 존재 여부 확인
     * 2) shop 없으면 noShop
     * 3) shop 있으면 해당 shop의 공고 목록 조회
     * 4) 공고 개수에 따라 shopNoPosting / full 분기
     */
    useEffect(() => {
        if (!userId) {
            SetErrorMessage("로그인 정보가 없습니다.");
            setViewMode("error");
            return;
        }

        async function fetchShopAndNotices() {
            try {
                setViewMode("loading");
                SetErrorMessage(null);

                // 1) 내 정보 조회
                const userRes = await getUser(userId);
                const userData = userRes.data as UserDetailResponse;
                const me = userData.item;

                // 2) 내 가게 정보 추출
                const shopData = me.shop?.item ?? null;

                // 가게가 아직 없으면 "noShop"
                if (!shopData) {
                    setShop(null);
                    setPosts([]);
                    setViewMode("noShop");
                    return;
                }

                setShop(shopData);

                // 3) 가게 공고 목록 조회
                const noticeRes = await listNoticesByShop(shopData.id);
                const noticesData = noticeRes.data as ShopNoticesResponse;
                const notices = noticesData.items.map(({ item }) => item);

                // 공고가 없으면 "shopNoPosting"
                if (notices.length === 0) {
                    setPosts([]);
                    setViewMode("shopNoPosting");
                    return;
                }

                // 4) 공고를 PostingItem 배열로 매핑 + 최신순 정렬
                const mappedPosts: PostingItem[] = notices.map((notice) =>
                    mapNoticeToPostingItem(notice, shopData),
                );

                mappedPosts.sort((a, b) => Number(b.id) - Number(a.id));

                setPosts(mappedPosts);
                setViewMode("full");
            }
            catch (error: unknown) {
                console.error(error);

                let msg = "가게 정보를 불러오는 중 오류가 발생했습니다.";

                if (error && typeof error === "object" && "response" in error) {
                    const e = error as { response?: { data?: { message?: string } } };
                    msg = e.response?.data?.message ?? msg;
                }

                SetErrorMessage(msg);
                setViewMode("error");
            }
        }

        fetchShopAndNotices();
    }, [userId]);

    // --------------- 뷰 렌더링 분기 --------------- //

    // 1) 로딩 상태
    if (viewMode === "loading") {
        return (
            <main className="w-full max-w-[964px] flex flex-col items-start">
                <section className="py-15">
                    <span className="tj-h1 text-gray-black">내 가게</span>
                    <p className="mt-4 tj-body1 text-gray-50">가게 정보를 불러오는 중입니다....</p>
                </section>
            </main>
        );
    }

    // 2) 에러 상태
    if (viewMode === "error") {
        return (
            <main className="w-full max-w-[964px] flex flex-col items-start">
                <section className="py-15">
                    <span className="tj-h1 text-gray-black">내 가게</span>
                    <p className="mt-4 tj-body1 text-red-500">
                        {errorMessage ?? "가게 정보를 불러오는 중 문제가 발생했습니다."}
                    </p>
                </section>
            </main>
        );
    }

    // 3) 가게 등록 전
    if (viewMode === "noShop") {
        return (
            <main className="w-full max-w-[964px] flex flex-col items-start">
                <section className="py-15">
                    <EmptySection
                        title="내 가게"
                        description="내 가게를 소개하고 공고도 등록해 보세요."
                        buttonLabel="가게 등록하기"
                        href="/owner/shop/new"
                    />
                </section>
            </main>
        );
    }

    // 아래부터는 shop이 반드시 있는 상태
    if (!shop) return null;

    // 4) 가게는 있지만 공고가 없는 상태
    if (viewMode === "shopNoPosting") {
        return (
            <main className="w-full max-w-[964px] flex flex-col items-start">
                <section className="py-15">
                    <ShopCard
                        heading="내 가게"
                        thumbnailUrl={shop.imageUrl}
                        category={shop.category}
                        name={shop.name}
                        locationText={shop.address1}
                        description={shop.description}
                        editHref="/owner/shop/edit"
                        createPostingHref="/owner/postings/new"
                    />
                </section>
                <section className="py-15">
                    <EmptySection
                        title="등록한 공고"
                        description="공고를 등록해 보세요."
                        buttonLabel="공고 등록하기"
                        href="/owner/postings/new"
                    />
                </section>
            </main>
        );
    }

    // 5) 가게와 공고 모두 있는 상태
    if (viewMode === "full") {
        return (
            <main className="w-full max-w-[964px]">
                <section className="py-15">
                    <ShopCard
                        heading="내 가게"
                        thumbnailUrl={shop.imageUrl}
                        category={shop.category}
                        name={shop.name}
                        locationText={shop.address1}
                        description={shop.description}
                        editHref="/owner/shop/edit"
                        createPostingHref="/owner/postings/new"
                    />
                </section>
                <section className="py-15">
                    <PostingList
                        posts={posts}
                        onCardClick={(post) => {
                            // 공고 카드 클릭시 공고 상세 페이지로 이동
                            // API: GET /shops/{shop_id}/notices/{notice_id}
                            // router.push(`/owner/shop/${shop.id}/notices/${post.id}`)
                        }}
                    />
                </section>
            </main>
        );
    }
}