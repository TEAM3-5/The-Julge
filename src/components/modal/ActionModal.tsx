"use client";

import Image from "next/image";
import { ModalBase } from "./ModalBase";
import Button from "@/components/common/Button";

type ActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // "예" 눌렀을 때 실행할 콜백
};

/**
 * ActionModal
 */
export function ActionModal({ isOpen, onClose, onConfirm }: ActionModalProps) {
  if (!isOpen) return null;

  const handleConfirmClick = () => {
    // "예" 버튼 클릭 시 콜백 실행 후 모달 닫기
    onConfirm();
    onClose();
  };

  return (
    <ModalBase onClose={onClose}>
      <div className="flex w-[250px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/images/ModalAction.svg"
            alt="확인 아이콘"
            width={24}
            height={24}
          />
          <p className="tj-body1 text-center text-gray-black">
            신청을 거절하시겠어요?
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
              아니오
            </span>
          </Button>
          <Button
            type="button"
            size="medium"
            onClick={handleConfirmClick}
          >
            <span className="w-10.5 flex items-center justify-center h-full">
              예 
            </span>
            
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
