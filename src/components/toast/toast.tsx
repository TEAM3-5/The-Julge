"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * 토스트 스타일 종류
 * - "error"  : 거절 / 실패 등
 * - "success": 성공
 * - "info"   : 일반 안내
 */
export type ToastVariant = "success" | "error" | "info";

/**
 * Toast 컴포넌트 Props
 */
type ToastProps = {
  isOpen: boolean;        // 토스트 노출 여부
  message: ReactNode;     // 토스트에 표시할 내용 (문자열 또는 ReactNode)
  variant?: ToastVariant; // 색상, 스타일 종류
};

/**
 * Toast UI 컴포넌트
 */
export function Toast({ isOpen, message, variant = "info" }: ToastProps) {
  // 서버 사이드 렌더링 시에는 아무 것도 렌더링 하지 않음
  if (typeof window === "undefined") return null;

  // 열려 있지 않으면 아무 것도 렌더링하지 않음
  if (!isOpen) return null;

  /**
   * variant에 따라 배경/텍스트 색상 분기
   */
  const variantClasses: Record<ToastVariant, string> = {
    error: "bg-red-30 text-white",
    success: "bg-green-20 text-white",
    info: "bg-gray-30 text-black",
  };
  const variantClass = variantClasses[variant];

  /**
   * createPortal
   * - 현재 컴포넌트 트리와 상관없이 document.body 바로 아래에 렌더링
   * - z-index / position 충돌 없이 전역 오버레이처럼 사용 가능
   */
  return createPortal(
    // 전체 화면을 덮는 래퍼 (클릭 막기 위해 pointer-events-none)
    <div className="fixed inset-x-0 bottom-12 z-9999 flex justify-center pointer-events-none">
      <div
        role="status"
        className={[
          // pointer-events-auto로 클릭 가능하게 설정(배경 클릭 막기 위해)
          "pointer-events-auto",
          "flex items-center justify-center rounded-[5px] tj-body1 px-4 py-2.5",
          variantClass,
        ].join(" ")}
      >
        {message}
      </div>
    </div>,
    document.body
  );
}
