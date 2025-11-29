"use client";

import { useState, useMemo } from "react";
import { Pagination } from "@/components/pagination/Pagination";
import { useModal } from "@/hooks/useModal";
import { PostCard } from "@/components/post/postCard";
import Button from "@/components/common/Button";
import { useToast } from "@/components/toast/toastProvider";
import { EmptySection } from "@/components/common/EmptySection";
import { ShopCard } from "@/components/owner/ShopCard";
import { PostingList, type PostingItem, } from "@/components/owner/PostingList"

export default function JunyeolPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 21;

  const { openConfirm, openAction } = useModal();

  const { showToast } = useToast();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지에 맞게 데이터를 다시 불러오거나 리스트 상태 업데이트 처리
  }

  const handleReject = () => {
    // 실제 거절 API 호출 등
    showToast("거절했어요.",
      {
        variant: "error",
      });
  };

  const handleOpenConfirmModal = () => {
    openConfirm({
      message: "가게 정보를 먼저 등록해 주세요.",
      buttonText: "확인",
      iconSrc: "/images/ModalConfirm.svg"
    });
  };

  const handleOpenActionModal = () => {
    openAction({
      title: "신청을 거절하시겠어요?",
      confirmText: "예",
      cancelText: "아니오",
      iconSrc: "/images/ModalAction.svg",
      onConfirm: handleReject,
    });
  };

  const MOCK_POST = {
    title: "도토리식당",
    scheduleText: "2023-01-02 15:00-18:00 (3시간)",
    locationText: "서울시 송파구",
    wage: 15000,
    wageBadgeText: "기존 시급보다 100%",
    thumbnailUrl: "/images/dotori.svg",
  };

  const MOCK_POSTS: PostingItem[] = [
    {
      id: 1,
      status: "active",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "기존 시급보다 100%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 2,
      status: "inactive",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "기존 시급보다 60%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 3,
      status: "inactive",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "기존 시급보다 100%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 4,
      status: "inactive",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "40%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 5,
      status: "active",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "기존 시급보다 70%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 6,
      status: "active",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "기존 시급보다 10%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 7,
      status: "active",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "150%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 8,
      status: "active",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "기존 시급보다 50%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 9,
      status: "inactive",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "기존 시급보다 80%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 10,
      status: "inactive",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "50%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 11,
      status: "active",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "기존 시급보다 100%",
      thumbnailUrl: "/images/dotori.svg",
    },
    {
      id: 12,
      status: "active",
      title: "도토리식당",
      scheduleText: "2023-01-02 15:00-18:00 (3시간)",
      locationText: "서울시 송파구",
      wage: 15000,
      wageBadgeText: "기존 시급보다 100%",
      thumbnailUrl: "/images/dotori.svg",
    },
  ];

  const sortedPosts = useMemo(() => {
    return MOCK_POSTS.slice().sort((a, b) => {
      return (b.id as number) - (a.id as number);
    });
  }, [MOCK_POSTS]);

  return (
    <div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        maxPageButtons={7}
      />

      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <Button
          size="medium"
          onClick={handleOpenConfirmModal}
        >
          Confirm 모달
        </Button>

        <Button
          size="medium"
          onClick={handleOpenActionModal}
        >
          Action 모달
        </Button>

        <Button
          size="medium"
          onClick={handleReject}
        >
          Toast 메시지
        </Button>
      </div>

      <div className="py-10 flex justify-center">
        <div className="w-164 mb-8 flex justify-center gap-6">
          <PostCard
            status="active"
            {...MOCK_POST}
          />
          <PostCard
            status="inactive"
            {...MOCK_POST}
            wageBadgeText="50%"
          />
        </div>
      </div>

      <div className="py-10">
        <EmptySection
          title="내 가게"
          description="내 가게를 소개하고 공고도 등록해 보세요."
          buttonLabel="가게 등록하기"
          href="/owner/postings/new"
        />
      </div>

      <div className="py-10">
        <EmptySection
          title="내 프로필"
          description="내 프로필을 등록하고 원하는 가게에 지원해 보세요."
          buttonLabel="내 프로필 등록하기"
          href="/member/profile/new"
        />
      </div>

      <div className="py-10">
        <ShopCard
          heading="내 가게"
          thumbnailUrl="/images/dotori.svg"
          category="식당"
          name="도토리 식당"
          locationText="서울시 송파구"
          description="알바하기 편한 너구리네 라면집! 라면 올려두고 끓이기만 하면 되어서 쉬운 편에 속하는 가게입니다."
          editHref="/owner/shop/edit"
          createPostingHref="/owner/postings/new"
        />
      </div>

      <div className="p-30 bg-gray-5">
        <EmptySection
          title="등록한 공고"
          description="공고를 등록해 보세요."
          buttonLabel="공고 등록하기"
          href="/owner/postings/new"
        />
      </div>

      <div className="py-10 mx-auto max-w-[964px]">
        <PostingList
          posts={sortedPosts}
          onCardClick={(post) => {
            console.log(`식당: ${post.id}번 ${post.title}`);
          }}
        />
      </div>

    </div>
  );
}