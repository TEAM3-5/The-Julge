'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePagination } from '@/hooks/usePagination';

/** 네모 숫자 버튼 */
type NumberButtonProps = {
  page: number;
  isActive: boolean;
  href?: string;
  onClick?: () => void;
};

function NumberButton({ page, isActive, href, onClick }: NumberButtonProps) {
  // 기본 클래스
  let classes = 'inline-flex items-center justify-center w-10 h-10 rounded-[4px] tj-body2';

  // 활성/비활성에 따른 스타일 추가
  if (isActive) {
    classes += ' bg-primary text-white';
  } else {
    classes += ' text-gray-black hover:bg-gray-100';
  }

  const content = <span>{page}</span>;

  if (href) {
    return (
      <Link
        href={href}
        scroll={false}
        aria-current={isActive ? 'page' : undefined}
        className={classes}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      className={classes}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

/** 좌우 화살표 버튼 */
type ArrowButtonProps = {
  direction: 'prev' | 'next';
  disabled: boolean;
  href?: string;
  onClick?: () => void;
};

function ArrowButton({ direction, disabled, href, onClick }: ArrowButtonProps) {
  const icon =
    direction === 'prev' ? (
      <Image
        src="/icons/icon-page-left.svg"
        alt="이전 페이지"
        width={16}
        height={16}
      />
    ) : (
      <Image
        src="/icons/icon-page-right.svg"
        alt="다음 페이지"
        width={16}
        height={16}
      />
    );

  const ariaLabel = direction === 'prev' ? '이전 페이지' : '다음 페이지';

  // 기본 클래스
  let classes = 'flex items-center justify-center w-10 h-10';

  if (disabled) {
    classes += ' opacity-40 cursor-not-allowed';
  } else {
    classes += ' text-gray-black';
  }

  const content = (
    <span className="inline-flex items-center justify-center w-5 h-5">
      {icon}
    </span>
  );

  // 링크 기반 이동
  if (href && !disabled) {
    return (
      <Link
        href={href}
        scroll={false}
        aria-label={ariaLabel}
        className={classes}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  // 버튼 기반 이동
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
      onClick={disabled ? undefined : onClick}
    >
      {content}
    </button>
  );
}

/** Pagination 메인 컴포넌트 props */
type PaginationProps = {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 콜백 (hrefBuilder가 없을 때 사용) */
  onPageChange?: (page: number) => void;
  /** 페이지별 링크 생성 함수 (존재하면 Link로 렌더링) */
  hrefBuilder?: (page: number) => string;
  /** 가운데에 보여줄 최대 페이지 버튼 수 */
  maxPageButtons?: number;
  /** 바깥 컨테이너에 추가로 적용할 Tailwind 클래스 */
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hrefBuilder,
  maxPageButtons = 7,
  className,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 0);
  const safeCurrentPage =
    safeTotalPages > 0 ? Math.min(Math.max(currentPage, 1), safeTotalPages) : 1;

  const pages = usePagination({
    currentPage: safeCurrentPage,
    totalPages: safeTotalPages,
    maxPageButtons,
  });

  // 1페이지 이하일 땐 굳이 안 보여줌
  if (safeTotalPages <= 1) return null;

  const isFirst = safeCurrentPage === 1;
  const isLast = safeCurrentPage === safeTotalPages;

  const buildHref = (page: number) =>
    hrefBuilder ? hrefBuilder(page) : undefined;

  const handleChange = (page: number) => {
    if (!onPageChange) return;
    if (page < 1 || page > safeTotalPages) return;
    if (page === safeCurrentPage) return;
    onPageChange(page);
  };

  // nav 클래스도 유틸 없이 처리
  const navClassName = className
    ? `flex items-center justify-center gap-0.5 ${className}`
    : 'flex items-center justify-center gap-0.5';

  return (
    <nav aria-label="Pagination" className={navClassName}>
      {/* 이전 화살표 */}
      <ArrowButton
        direction="prev"
        disabled={isFirst}
        href={!isFirst ? buildHref(safeCurrentPage - 1) : undefined}
        onClick={
          !hrefBuilder
            ? () => handleChange(safeCurrentPage - 1)
            : undefined
        }
      />

      {/* 숫자 버튼 */}
      {pages.map((page) => (
        <NumberButton
          key={page}
          page={page}
          isActive={page === safeCurrentPage}
          href={hrefBuilder ? buildHref(page) : undefined}
          onClick={!hrefBuilder ? () => handleChange(page) : undefined}
        />
      ))}

      {/* 다음 화살표 */}
      <ArrowButton
        direction="next"
        disabled={isLast}
        href={!isLast ? buildHref(safeCurrentPage + 1) : undefined}
        onClick={
          !hrefBuilder
            ? () => handleChange(safeCurrentPage + 1)
            : undefined
        }
      />
    </nav>
  );
}
