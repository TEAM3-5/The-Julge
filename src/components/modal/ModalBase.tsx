"use client";

import { ReactNode, useEffect, useRef, MouseEvent } from "react";
import { createPortal } from "react-dom";

type ModalBaseProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * 공통 모달 레이아웃
 * - SSR 환경에서는 아무것도 렌더링하지 않음
 * - 클라이언트 + isOpen === true일 때만 Portal로 모달 렌더
 */
export function ModalBase({ isOpen, onClose, children }: ModalBaseProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  /**
   * ESC + Tab 키 포커스 트랩 처리
   * - ESC: 모달 닫기
   * - Tab: 포커스를 모달 내부에 가둠
   */
  // useEffect(() => {
  //   if (!isOpen) return; // 모달이 열려 있을 때만 이벤트 등록

  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (!dialogRef.current) return;

  //     if (e.key === "Escape") {
  //       e.preventDefault();
  //       onClose();
  //       return;
  //     }

  //     if (e.key === "Tab") {
  //       const focusableSelectors =
  //         'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  //       const focusable = Array.from(
  //         dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
  //       ).filter((el) => !el.hasAttribute("disabled"));

  //       if (focusable.length === 0) return;

  //       const first = focusable[0];
  //       const last = focusable[focusable.length - 1];

  //       if (e.shiftKey) {
  //         // Shift + Tab : 첫 요소에서 뒤로 가면 마지막으로
  //         if (document.activeElement === first) {
  //           e.preventDefault();
  //           last.focus();
  //         }
  //       } else {
  //         // Tab : 마지막 요소에서 앞으로 가면 첫 요소로
  //         if (document.activeElement === last) {
  //           e.preventDefault();
  //           first.focus();
  //         }
  //       }
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [isOpen, onClose]);

  /**
   * body 스크롤 방지
   * - 모달이 열려 있는 동안만 body 스크롤을 막음
   */
  // useEffect(() => {
  //   if (!isOpen) return;

  //   const originalOverflow = document.body.style.overflow;
  //   document.body.style.overflow = "hidden";

  //   return () => {
  //     document.body.style.overflow = originalOverflow;
  //   };
  // }, [isOpen]);

  /**
   * 최초 포커스 이동
   * - 모달이 열릴 때 내부의 첫 번째 포커스 가능한 요소로 포커스 이동
   */
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const focusableSelectors =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const focusable =
      dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors);

    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  /**
   * SSR 방어
   * - 서버 환경에서는 document가 없으므로 Portal을 만들 수 없음
   * - 이 경우 아무것도 렌더링하지 않음
   */
  if (typeof document === "undefined" || !isOpen) {
    return null;
  }

  /**
   * 백드롭 클릭 시 모달 닫기
   * - 배경(검은 영역)을 클릭했을 때만 닫히고,
   *   모달 내용 클릭 시에는 전파되지 않도록 처리
   */
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="rounded-xl bg-white p-6 shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
