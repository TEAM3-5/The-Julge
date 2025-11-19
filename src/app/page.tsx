"use client";

import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination/Pagination";

export default function Home() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  // 쿼리 없으면 1페이지
  const rawPage = pageParam ? Number(pageParam) || 1 : 1;
  // 나중에 실제 데이터 개수로 계산해서 채우면 됨
  const totalPages = 21;
  // 잘못된 값이 들어와도 안전하게 1~totalPages로 보정
  const currentPage = Math.min(Math.max(rawPage, 1), totalPages);

  return (
    <div>
      <div className="flex justify-center">메인 페이지 입니당</div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hrefBuilder={(p) => `?page=${p}`}
        maxPageButtons={7}
        mode="full"
      />
    </div>
  );
}