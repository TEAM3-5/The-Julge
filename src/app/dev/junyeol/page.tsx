"use client";

import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination/Pagination";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { ActionModal } from "@/components/modal/ActionModal";
import { useModal } from "@/hooks/UseModal";
import { PostCard } from "@/components/post/postCard";

export default function JunyeolPage() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const rawPage = pageParam ? Number(pageParam) || 1 : 1;
  const totalPages = 21;
  const currentPage = Math.min(Math.max(rawPage, 1), totalPages);

  const confirmModal = useModal();
  const actionModal = useModal();

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
        hrefBuilder={(p) => `?page=${p}`}
        maxPageButtons={7}
        mode="full"
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