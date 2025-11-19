"use client";

import Link from "next/link";
import React from "react";

/** 여러 className 문자열을 합쳐주는 유틸 함수 */
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

/** 숫자 버튼 props 
 *  variant: "number"일 때 사용
*/
type PaginationNumberButtonProps = {
  variant: "number";    // 숫자 버튼임을 나타내는 플래그
  page: number;         // 버튼에 표시할 페이지 번호
  isActive?: boolean;   // 현재 선택된 페이지인지 여부
  disabled?: boolean;   // 비활성화 여부
  href?: string;        // 존재하면 <link>, 없으면 <button>으로 렌더링
  onClick?: () => void; // 클릭 핸들러
};

/** 화살표 버튼 props
 *  variant: "arrow"일 때 사용
*/
type PaginationArrowButtonProps = {
  variant: "arrow";           // 화살표 버튼임을 나타내는 플래그
  direction: "prev" | "next"; // 이전/다음 방향
  disabled?: boolean;         // 비활성화 여부
  href?: string;              // 존재하면 <link>, 없으면 <button>으로 렌더링
  onClick?: () => void;       // 클릭 핸들러
};

/**
 * PaginationButton 컴포넌트 전체 props
 * variant에 따라 숫자 버튼 또는 화살표 버튼으로 동작
 */
export type PaginationButtonProps =
  | PaginationNumberButtonProps
  | PaginationArrowButtonProps;

/**
 * 공용 PaginationButton 컴포넌트
 * - variant="number": 숫자 버튼
 * - variant="arrow": 화살표 버튼
 */
export const PaginationButton: React.FC<PaginationButtonProps> = (props) => {
  // ---------- 숫자(number) 버튼 ----------
  if (props.variant === "number") {
    const {
      page,
      isActive = false, // 기본값: 비활성
      disabled = false, // 기본값: 활성
      href,
      onClick,
    } = props;

    // 공통 스타일
    const base =
      "inline-flex items-center justify-center w-10 h-10 rounded-[4px] tj-body2";
    // 현재 페이지(active) 여부에 따라 스타일 분기
    const classes = cn(
      base,
      isActive
        ? "bg-red-30 text-white"               // 선택 숫자 버튼
        : "text-gray-black hover:bg-gray-100"  // 일반 숫자 버튼
    );

    // 버튼 안에 들어갈 내용
    const content = <span>{page}</span>;

    // href가 있으면 Link, 없으면 button 렌더링
    if (href && !disabled) {
      return (
        <Link
          href={href}
          aria-current={isActive ? "page" : undefined}
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
        aria-current={isActive ? "page" : undefined}
        className={classes}
        onClick={disabled ? undefined : onClick}
      >
        {content}
      </button>
    );
  }

  // ---------- 화살표(arrow) 버튼 ----------
  const { direction, disabled = false, href, onClick } = props;

  // 방향에 따라 아이콘과 aria-label 설정
  const icon = direction === "prev" ? "‹" : "›";
  const ariaLabel = direction === "prev" ? "이전 페이지" : "다음 페이지";

  // 공통 스타일
  const baseClasses = cn(
    "flex items-center justify-center w-10 h-10",
    disabled
      ? "text-gray-40 cursor-not-allowed"  // 비활성 스타일
      : "text-gray-black" // 활성 스타일
  );

  const IconSpan = (
    <span className="inline-flex items-center justify-center w-5 h-5">
      {icon}
    </span>
  );

  // href가 있으면 Link, 없으면 button 렌더링
  if (href && !disabled) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={baseClasses}
        onClick={onClick}
      >
        {IconSpan}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      className={baseClasses}
      onClick={disabled ? undefined : onClick}
    >
      {IconSpan}
    </button>
  );
};