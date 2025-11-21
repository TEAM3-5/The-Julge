'use client';

import React from 'react';
import { usePagination } from '@/hooks/usePagination';
import { PaginationButton } from './PaginationButton';

type PaginationMode = 'simple' | 'full';

type PaginationProps = {
  currentPage: number /** 현재 페이지 (1부터 시작) */;
  totalPages: number /** 전체 페이지 수 */;
  onPageChange?: (page: number) => void /** 페이지 변경 콜백 */;
  hrefBuilder?: (page: number) => string /** 페이지별 링크 생성 */;
  maxPageButtons?: number /** 가운데에 보여줄 최대 페이지 버튼 수 */;
  mode?: PaginationMode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/** 여러 className 문자열을 합쳐주는 유틸 함수 */
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

/**
 * 공용 Pagination 컴포넌트
 * - currentPage, totalPages만 넘겨주면 내부에서 페이지 버튼 계산
 * - hrefBuilder가 있으면 link로, 없으면 onPageChange 콜백으로 동작
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hrefBuilder,
  maxPageButtons = 7,
  className,
}) => {
  // 훅에 넣을 totalPages / currentPage 계산
  const safeTotalPages = Math.max(totalPages, 0);
  // currentPage를 1~totalPages 범위로 보정
  const safeCurrentPage =
    safeTotalPages > 0 ? Math.min(Math.max(currentPage, 1), safeTotalPages) : 1;

  // 페이지 번호 배열 계산
  const pageNumbers = usePagination({
    currentPage: safeCurrentPage,
    totalPages: safeTotalPages,
    maxPageButtons,
  });

  // 페이지가 없으면 아무것도 렌더링하지 않음
  if (safeTotalPages <= 0) return null;

  /** 내부에서 사용하는 페이지 변경 핸들러 (범위 체크 포함)*/
  const handleChange = (page: number) => {
    if (!onPageChange) return;
    if (page < 1 || page > safeTotalPages) return;
    if (page === safeCurrentPage) return; // 동일 페이지 변경 방지
    onPageChange(page);
  };

  const isFirst = safeCurrentPage === 1;
  const isLast = safeCurrentPage === safeTotalPages;

  // hrefbuilder가 있으면 링크 문자열 생성, 없으면 undefined 반환
  const buildHref = (page: number) => (hrefBuilder ? hrefBuilder(page) : undefined);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-0.5', className)}
    >
      {/* 이전 화살표 */}
      <PaginationButton
        variant="arrow"
        direction="prev"
        disabled={isFirst}
        href={!isFirst && hrefBuilder ? buildHref(safeCurrentPage - 1) : undefined}
        onClick={!hrefBuilder && !isFirst ? () => handleChange(safeCurrentPage - 1) : undefined}
      />

      {/* 숫자 버튼 */}
      {pageNumbers.map((page) => (
        <PaginationButton
          key={page}
          variant="number"
          page={page}
          isActive={page === safeCurrentPage}
          href={hrefBuilder ? buildHref(page) : undefined}
          onClick={!hrefBuilder ? () => handleChange(page) : undefined}
        />
      ))}

      {/* 다음 화살표 */}
      <PaginationButton
        variant="arrow"
        direction="next"
        disabled={isLast}
        href={!isLast && hrefBuilder ? buildHref(safeCurrentPage + 1) : undefined}
        onClick={!hrefBuilder && !isLast ? () => handleChange(safeCurrentPage + 1) : undefined}
      />
    </nav>
  );
};

// const searchParams = useSearchParams();
// const pageParam = searchParams.get("page");
// // 쿼리 없으면 1페이지
// const rawPage = pageParam ? Number(pageParam) || 1 : 1;
// // 나중에 실제 데이터 개수로 계산해서 채우면 됨
// const totalPages = 21;
// // 잘못된 값이 들어와도 안전하게 1~totalPages로 보정
// const currentPage = Math.min(Math.max(rawPage, 1), totalPages);
//   <Pagination
//   currentPage={currentPage}
//   totalPages={totalPages}
//   hrefBuilder={(p) => `?page=${p}`}
//   maxPageButtons={7}
//   mode="full"
// />
