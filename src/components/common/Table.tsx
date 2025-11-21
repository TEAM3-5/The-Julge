'use client';

import Button from '@/components/common/Button';
import type { ShiftRow, ShiftStatus } from '@/features/shifts/model';

type TableProps = {
  rows: ShiftRow[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

export default function Table({ rows, onApprove, onReject }: TableProps) {
  return (
    <section className="rounded-xl border border-gray-20 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-10">
              <Th>가게</Th>
              <Th>일자</Th>
              <Th>시급</Th>
              <Th className="text-left pr-6">상태</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-10 last:border-b-0">
                <Td>{row.storeName}</Td>
                <Td>{row.dateText}</Td>
                <Td>{row.wageText}</Td>
                <Td className="text-left pr-6">
                  <StatusCell
                    status={row.status}
                    onApprove={() => onApprove(row.id)}
                    onReject={() => onReject(row.id)}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type ThProps = {
  children: React.ReactNode;
  className?: string;
};

function Th({ children, className = '' }: ThProps) {
  return (
    <th className={`tj-body2 text-left py-3 px-6 text-gray-black ${className}`}>{children}</th>
  );
}

type TdProps = {
  children: React.ReactNode;
  className?: string;
};

function Td({ children, className = '' }: TdProps) {
  return (
    <td className={`h-[60px] tj-body1 px-6 text-gray-black align-middle ${className}`}>
      {children}
    </td>
  );
}

type StatusCellProps = {
  status: ShiftStatus;
  onApprove?: () => void;
  onReject?: () => void;
};

function StatusCell({ status, onApprove, onReject }: StatusCellProps) {
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

  if (status === 'APPROVED') {
    return <ApproveStatus className="bg-blue-10 text-blue-20">승인 완료</ApproveStatus>;
  } else if (status === 'REJECTED') {
    return <ApproveStatus className="bg-red-10 text-red-40">거절</ApproveStatus>;
  } else {
    return <ApproveStatus className="bg-green-10 text-green-20">대기중</ApproveStatus>;
  }
}

function ApproveStatus({ children, className = '' }: ApproveStatus) {
  return (
    <span className={`tj-body2-bold inline-flex rounded-full px-[10px] py-[6px] ${className}`}>
      {children}
    </span>
  );
}

type ApproveStatus = {
  children: React.ReactNode;
  className?: string;
};
