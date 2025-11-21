"use client";

import Image from "next/image";
import { ModalBase } from "./ModalBase";
import { Button } from "@/components/common/Button";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * ConfirmModal
 */
export function ConfirmModal({ isOpen, onClose }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <ModalBase onClose={onClose}>
      <div className="flex w-[250px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/images/ModalConfirm.svg"
            alt="알림 아이콘"
            width={24}
            height={24}
          />
          <p className="tj-body1 text-center text-gray-black">
            가게 정보를 먼저 등록해 주세요.
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
              확인
            </span>
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
