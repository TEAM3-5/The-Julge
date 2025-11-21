"use client";

import { ReactNode, useEffect, MouseEvent } from "react";

type ModalBaseProps = {
  onClose: () => void;
  children: ReactNode;
};

/**
 * 공통 모달 레이아웃
 */
export function ModalBase({ onClose, children }: ModalBaseProps) {

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 백드롭(모달 외부) 클릭 시 모달 닫기
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="rounded-xl bg-white px-6 py-6 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
        {children}
      </div>
    </div>
  );
}
