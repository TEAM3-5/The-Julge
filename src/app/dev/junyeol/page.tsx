"use client";

import { useState } from "react";
import { Pagination } from "@/components/pagination/Pagination";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { ActionModal } from "@/components/modal/ActionModal";
import { useModal } from "@/hooks/UseModal";
import { PostCard } from "@/components/post/postCard";

export default function JunyeolPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 21;

  const confirmModal = useModal();
  const actionModal = useModal();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지에 맞게 데이터를 다시 불러오거나 리스트 상태 업데이트 처리
  }

  const handleReject = () => {
    // 실제 거절 API 호출 등
    console.log("거절 확정");
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
        <button
          className="w-80 border px-4 py-2"
          onClick={confirmModal.open}
        >
          Confirm 모달
        </button>

        <button
          className="w-80 border px-4 py-2"
          onClick={actionModal.open}
        >
          Action 모달
        </button>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
      />

      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={actionModal.close}
        onConfirm={handleReject}
      />

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