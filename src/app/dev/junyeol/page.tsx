"use client";

import { useState } from "react";
import { Pagination } from "@/components/pagination/Pagination";
import { useModal } from "@/hooks/useModal";
import { PostCard } from "@/components/post/postCard";
import Button from "@/components/common/Button";
import { useToast } from "@/components/toast/toastProvider";

export default function JunyeolPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 21;

  const { openConfirm, openAction} = useModal();

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

      <div className="py-10">
        <div className="mb-8 flex justify-center gap-6">
          <PostCard
            status="active"
            size="large"
            {...MOCK_POST}
          />
          <PostCard
            status="inactive"
            size="large"
            {...MOCK_POST}
            wageBadgeText="50%"
          />
        </div>

        <div className="flex justify-center gap-6">
          <PostCard
            status="active"
            size="small"
            {...MOCK_POST}
          />
          <PostCard
            status="inactive"
            size="small"
            {...MOCK_POST}
          />
        </div>
      </div>

    </div>

  );
}