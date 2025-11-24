'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePagination } from '@/hooks/usePagination';

/** 여러 className 문자열을 합쳐주는 유틸 함수 */
function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/** 숫자 네모 버튼 */
type NumberButtonProps = {
  page: number;
  isActive: boolean;
  href?: string;
  onClick?: () => void;
};

function NumberButton({ page, isActive, href, onClick }: NumberButtonProps) {
  const classes = classNames(
    'inline-flex items-center justify-center w-10 h-10 rounded-[4px] tj-body2',
    isActive ? 'bg-red-30 text-white' : 'text-gray-black hover:bg-gray-100',
  );

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

/** 화살표 버튼 */
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

  const classes = classNames(
    'flex items-center justify-center w-10 h-10',
    disabled ? 'opacity-40 cursor-not-allowed' : 'text-gray-black',
  );

  const content = (
    <span className="inline-flex items-center justify-center w-5 h-5">
      {icon}
    </span>
  );

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

/** 실제 Pagination 컴포넌트 */
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  hrefBuilder?: (page: number) => string;
  maxPageButtons?: number;
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

  return (
    <nav
      aria-label="Pagination"
      className={classNames(
        'flex items-center justify-center gap-0.5',
        className,
      )}
    >
      {/* 이전 화살표 */}
      <ArrowButton
        direction="prev"
        disabled={isFirst}
        href={!isFirst ? buildHref(safeCurrentPage - 1) : undefined}
        onClick={
          !hrefBuilder && !isFirst
            ? () => handleChange(safeCurrentPage - 1)
            : undefined
        }
      />

      {/* 숫자 버튼들 */}
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
          !hrefBuilder && !isLast
            ? () => handleChange(safeCurrentPage + 1)
            : undefined
        }
      />
    </nav>
  );
}
