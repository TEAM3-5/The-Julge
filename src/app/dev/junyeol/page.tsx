"use client";

import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination/Pagination";
import { PostCard } from "@/components/post/postCard";

export default function JunyeolPage() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const rawPage = pageParam ? Number(pageParam) || 1 : 1;
  const totalPages = 21;
  const currentPage = Math.min(Math.max(rawPage, 1), totalPages);
  const MOCK_POST = {
    title: "도토리식당",
    scheduleText: "2023-01-02 15:00-18:00 (3시간)",
    locationText: "서울시 송파구",
    wage: 15000,
    wageBadgeText: "기존 시급보다 100%",
    thumbnailUrl: "/images/logo.svg",
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
      <div className="mx-auto max-w-[1080px] py-10">
        <section className="flex justify-center gap-4">
          <PostCard status="active" size="large" {...MOCK_POST} />
          <PostCard status="inactive" size="large" {...MOCK_POST} />
        </section>
      </div>
    </div>
  );
}