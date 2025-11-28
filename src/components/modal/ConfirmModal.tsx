"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { ModalBase } from "./ModalBase";
import Button from "@/components/e/Button";

export type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;

  message?: ReactNode;
  buttonText?: string;
  iconSrc?: string | null;
  iconAlt?: string;
};

/**
 * ConfirmModal
 */
export function ConfirmModal({  
  isOpen,
  onClose,
  message = "가게 정보를 먼저 등록해 주세요.",
  buttonText = "확인",
  iconSrc = "/images/ModalConfirm.svg",
  iconAlt = "알림 아이콘",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="flex w-[250px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          {iconSrc && (
            <Image src={iconSrc} alt={iconAlt ?? ""} width={24} height={24} />
          )}
          <p className="tj-body1 text-center text-gray-black">
            {message}
          </p>
        </div>

        <div className="flex w-full justify-center">
          <Button
            type="button"
            variant="outline"
            size="medium"
            onClick={onClose}
          >
            <span className="w-10.5 flex items-center justify-center h-full">
              {buttonText}
            </span>
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
