'use client';

import type { ShiftRow, ShiftStatus } from '@/features/shifts/model';

type TableProps = {
  rows: ShiftRow[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

export default function Table({ rows, onApprove, onReject }: TableProps) {
  const pageRows = rows;

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
            {rows.map((row, idx) => (
              <tr key={row.id} className="border-b border-gray-10 last:border-b-0">
                <Td>{row.storeName}</Td>
                <Td>{row.dateText}</Td>
                <Td>{row.wageText}</Td>
                <Td className="text-left pr-6">
                  <StatusCell
                    status={row.status}
                    onApprove={() => onApprove(row.id)}
                    onReject={() => onReject(row.id)}
                    isFirstRow={idx === 0}
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
  return <td className={`tj-body1 py-4 px-6 align-middle ${className}`}>{children}</td>;
}

type StatusCellProps = {
  status: ShiftStatus;
  onApprove?: () => void;
  onReject?: () => void;
  isFirstRow?: boolean;
};

function StatusCell({ status, onApprove, onReject, isFirstRow }: StatusCellProps) {
  if (status === 'PENDING') {
    return (
      <div className="flex justify-start gap-2">
        <button
          type="button"
          onClick={onReject}
          className="transition tj-body2 rounded-md border border-primary px-4 py-1 text-primary hover:bg-primary hover:text-white"
        >
          거절하기
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="transition tj-body2 rounded-md border border-blue-20 px-4 py-1 text-blue-20 hover:bg-blue-20 hover:text-white"
        >
          승인하기
        </button>
      </div>
    );
  }

  if (status === 'APPROVED') {
    return (
      <span className="tj-body2 inline-flex rounded-full bg-blue-10 px-4 py-1 text-blue-20">
        승인 완료
      </span>
    );
  }

  if (status === 'REJECTED') {
    return (
      <span className="tj-body2 inline-flex rounded-full bg-red-10 px-4 py-1 text-red-40">
        거절
      </span>
    );
  } else {
    return (
      <span className="tj-body2 inline-flex rounded-full bg-green-10 px-4 py-1 text-green-20">
        대기중
      </span>
    );
  }
}
