'use client';

import Button from '@/components/e/Button';
import type { ReactNode } from 'react';

export type StatusChipProps = {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING';
  onApprove?: () => void;
  onReject?: () => void;
};

export function StatusChip({ status, onApprove, onReject }: StatusChipProps) {
  if (status === 'PENDING') {
    return (
      <div className="flex justify-start gap-2">
        <Button variant="outline" size="medium" onClick={onReject}>
          거절하기
        </Button>
        <Button variant="outline" size="medium" onClick={onApprove} btnColor="blue">
          승인하기
        </Button>
      </div>
    );
  }

  const labelMap: Record<Exclude<StatusChipProps['status'], 'PENDING'>, ReactNode> = {
    APPROVED: '승인 완료',
    REJECTED: '거절',
    WAITING: '대기중',
  };

  const colorMap: Record<Exclude<StatusChipProps['status'], 'PENDING'>, string> = {
    APPROVED: 'bg-blue-10 text-blue-20',
    REJECTED: 'bg-red-10 text-red-40',
    WAITING: 'bg-green-10 text-green-20',
  };

  return (
    <span
      className={`tj-body2-bold inline-flex rounded-full px-[10px] py-[6px] ${colorMap[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}
