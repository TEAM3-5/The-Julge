"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EmptySection } from "@/components/common/EmptySection";
import { ShopCard } from "@/components/owner/ShopCard";
import { PostingList, type PostingItem, } from "@/components/owner/PostingList"

import { getUser } from "@/api/users";
import { listNoticesByShop } from "@/api/notices";
import { useAuthStore } from "@/stores/auth";

import type { Shop } from "@/types/shop";
import type { Notice, NoticeListResponse } from "@/types/notice";
import type { UserDetailResponse } from "@/types/user";

/**
 * 화면에서 사용할 뷰 상태
 * loading          : API 호출 중
 * noShop           : 가게 등록이 안된 상태
 * shopNoPosting    : 가게는 있지만 등록한 공고가 없는 상태
 * full             : 가게 + 공고 모두 있는 상태
 * error            : API 에러 발생
 */
type ViewMode = "loading" | "noShop" | "shopNoPosting" | "full" | "error";

// API 응답 타입을 안전하게 확인하기 위한 타입 가드
function isUserDetailResponse(data: unknown): data is UserDetailResponse {
    if (!data || typeof data !== "object") return false;

    const obj = data as { item?: unknown };
    if (!obj.item || typeof obj.item !== "object") return false;

    const item = obj.item as { id?: unknown; email?: unknown };
    return typeof item.id === "string" && typeof item.email === "string";
}

// 공고 목록 응답 타입 가드
function isNoticeListResponse(data: unknown): data is NoticeListResponse {
    if (!data || typeof data !== "object") return false;

    const obj = data as { items?: unknown };
    if (!Array.isArray(obj.items)) return false;

    return obj.items.every((entry) => {
        if (!entry || typeof entry !== "object") return false;
        const e = entry as { item?: unknown };
        return !!e.item;
    });
}

// 날짜 문구 변환
function formatDateTimeShort(iso: string) {
    try {
        return new Date(iso).toISOString().slice(0, 16).replace('T', ' ');
    } catch {
        return iso; // 파싱 실패 시 원본 문자열 반환
    }
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
        }
        // 0 이하일 때는 undefined
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
        thumbnailUrl: shop.imageUrl || "/images/dotori.svg",
    };
}

export default function ShopDetailPage({
    params,
}: {
    params: { shopId: string };
}) {
    const router = useRouter();
    const { shopId } = params;

    // 로그인 유저 id 가져오기
    const user = useAuthStore((state) => state.user);
    const userId = user?.id ?? "";

    // 현재 뷰 상태(로딩 / 에러 / 가게 없음 / 가게만 있음 / 가게+공고 있음 )
    const [viewMode, setViewMode] = useState<ViewMode>("loading");

    // 현재 사장님의 가게 정보
    const [shop, setShop] = useState<Shop | null>(null);

    // PostingList에 넘겨줄 공고 카드 데이터 배열
    const [posts, setPosts] = useState<PostingItem[]>([]);

    // 에러 메시지
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    /**
     * 마운트 시 / userId 변경 시
     * 1) 내 정보 조회 -> shop 존재 여부 확인
     * 2) shop 없으면 noShop
     * 3) shop 있으면 해당 shop의 공고 목록 조회
     * 4) 공고 개수에 따라 shopNoPosting / full 분기
     */
    useEffect(() => {
        if (!userId) return;
        if (!shopId) {
            // shopId가 없는 URL이면 바로 에러 처리
            setErrorMessage("가게 정보가 올바르지 않습니다.");
            setViewMode("error");
            return;
        }

        async function fetchShopAndNotices() {
            try {
                setViewMode("loading");
                setErrorMessage(null);

                // 1) 내 정보 조회
                const userRes = await getUser(userId);
                const userData = userRes.data;
                if (!isUserDetailResponse(userData)) {
                    throw new Error("예상치 못한 사용자 응답 형식입니다.");
                }
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

                // URK의 shopId와 실제 내 가게 id가 다르면 에러 처리
                if (shopData.id !== shopId) {
                    setShop(null);
                    setPosts([]);
                    setErrorMessage("URL의 가게 정보와 내 가게 정보가 일치하지 않습니다.");
                    setViewMode("error");
                    return;
                }

                setShop(shopData);

                // 3) 가게 공고 목록 조회
                const noticeRes = await listNoticesByShop(shopId);
                const noticesData = noticeRes.data;
                if (!isNoticeListResponse(noticesData)) {
                    throw new Error("예상치 못한 공고 목록 응답 형식입니다.");
                }
                const notices = noticesData.items.map(({ item }) => item);


                // 공고가 없으면 "shopNoPosting"
                if (notices.length === 0) {
                    setPosts([]);
                    setViewMode("shopNoPosting");
                    return;
                }

                // 4) 공고를 PostingItem 배열로 매핑 + 최신순 정렬
                const sortedNotices = [...notices].sort(
                    (a, b) =>
                        new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
                );

                const mappedPosts: PostingItem[] = sortedNotices.map((notice) =>
                    mapNoticeToPostingItem(notice, shopData),
                );

                setPosts(mappedPosts);
                setViewMode("full");
            }
            catch (error: unknown) {
                console.error(error);

                let msg = "가게 정보를 불러오는 중 오류가 발생했습니다.";

                if (error && typeof error === "object" && "response" in error) {
                    const e = error as { response?: { data?: { message?: string } } };
                    msg = e.response?.data?.message ?? msg;
                } else if (error instanceof Error && error.message) {
                    msg = error.message;
                }

                setErrorMessage(msg);
                setViewMode("error");
            }
        }

        fetchShopAndNotices();
    }, [userId, shopId]);

    // --------------- 뷰 렌더링 분기 --------------- //

    // 로그인 안 된 경우 (userId 없음)
    if (!userId) {
        return (
            <main className="w-full max-w-[964px] flex flex-col items-start">
                <section className="py-15">
                    <span className="tj-h1 text-gray-black">내 가게</span>
                    <p className="mt-4 tj-body1 text-red-500">
                        로그인 정보가 없습니다. 먼저 로그인해 주세요.
                    </p>
                </section>
            </main>
        );
    }

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
                        thumbnailUrl={shop.imageUrl || "/images/dotori.svg"}
                        category={shop.category}
                        name={shop.name}
                        locationText={shop.address1}
                        description={shop.description}
                        editHref={`/owner/shops/${shop.id}/edit`}
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
                        thumbnailUrl={shop.imageUrl || "/images/dotori.svg"}
                        category={shop.category}
                        name={shop.name}
                        locationText={shop.address1}
                        description={shop.description}
                        editHref={`/owner/shops/${shop.id}/edit`}
                        createPostingHref="/owner/postings/new"
                    />
                </section>
                <section className="py-15">
                    <PostingList
                        posts={posts}
                        onCardClick={(post) => {
                            // 공고 카드 클릭시 공고 상세 페이지로 이동
                            // API: GET /shops/{shop_id}/notices/{notice_id} 폴더 구조 수정 필요
                            router.push(`/owner/shops/${shop.id}/notices/${post.id}`)
                        }}
                    />
                </section>
            </main>
        );
    }

    return null;
}