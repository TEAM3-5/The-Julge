"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { ModalBase } from "./ModalBase";
import Button from "@/components/e/Button";

export type ActionModalProps = {
  isOpen: boolean;
  onClose: () => void;

  onConfirm: () => void; // "예" 눌렀을 때 실행할 콜백
  
  title?: ReactNode;
  confirmText?: string;
  cancelText?: string;

  iconSrc?: string;
  iconAlt?: string;
};

/**
 * ActionModal
 */
export function ActionModal({
  isOpen,
  onClose,
  onConfirm,
  title = "신청을 거절하시겠어요?",
  confirmText = "예",
  cancelText = "아니오",
  iconSrc = "/images/ModalAction.svg",
  iconAlt = "확인 아이콘",
}: ActionModalProps) {
  if (!isOpen) return null;

  const handleConfirmClick = () => {
    onConfirm();
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="flex w-[250px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <Image src={iconSrc} alt={iconAlt ?? ""} width={24} height={24} />
          <p className="tj-body1 text-center text-gray-black">
            {title}
          </p>
        </div>

        <div className="flex w-full justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="medium"
            onClick={onClose}
          >
            <span className="w-10.5 flex items-center justify-center h-full">
              {cancelText}
            </span>
          </Button>
          <Button
            type="button"
            size="medium"
            onClick={handleConfirmClick}
          >
            <span className="w-10.5 flex items-center justify-center h-full">
              {confirmText}
            </span>
            
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
