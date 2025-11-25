"use client";

import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination/Pagination";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { ActionModal } from "@/components/modal/ActionModal";
import { useModal } from "@/hooks/UseModal";
import { PostCard } from "@/components/post/postCard";
import Button from "@/components/common/Button";
import { useToast } from "@/components/toast/toastProvider";

export default function JunyeolPage() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const rawPage = pageParam ? Number(pageParam) || 1 : 1;
  const totalPages = 21;
  const currentPage = Math.min(Math.max(rawPage, 1), totalPages);

  const confirmModal = useModal();
  const actionModal = useModal();
  const { showToast } = useToast();

  const handleReject = () => {
    // 실제 거절 API 호출 등
    showToast("거절했어요.",
      {
        variant: "error",
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
        hrefBuilder={(p) => `?page=${p}`}
        maxPageButtons={7}
        mode="full"
      />

      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <Button
          size="medium"
          onClick={confirmModal.open}
        >
          Confirm 모달
        </Button>

        <Button
          size="medium"
          onClick={actionModal.open}
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