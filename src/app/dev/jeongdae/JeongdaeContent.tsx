'use client';

import { useSearchParams } from 'next/navigation';
import Table from '@/components/common/Table';
import type { ShiftRow } from '@/features/shifts/model';
import { Pagination } from '@/components/pagination/Pagination';
import Filter from '@/components/common/Filter';

// 임시 더미 데이터 (나중에 API 데이터로)
const MOCK_ROWS: ShiftRow[] = [
  {
    id: 1,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'PENDING',
  },
  {
    id: 2,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'APPROVED',
  },
  {
    id: 3,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'REJECTED',
  },
  {
    id: 4,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'WAITING',
  },
  {
    id: 5,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'WAITING',
  },
  {
    id: 6,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'WAITING',
  },
  {
    id: 7,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'REJECTED',
  },
  {
    id: 8,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'PENDING',
  },
  {
    id: 9,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'PENDING',
  },
  {
    id: 10,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'APPROVED',
  },
  {
    id: 11,
    storeName: '너구리네 라면집',
    dateText: '2023.01.12 10:00 ~ 12:00 (2시간)',
    wageText: '12,500원',
    status: 'WAITING',
  },
];

const ROWS_PER_PAGE = 5;

export default function JeongdaeContent() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const rawPage = pageParam ? Number(pageParam) || 1 : 1;

  const totalPages = Math.max(1, Math.ceil(MOCK_ROWS.length / ROWS_PER_PAGE));
  const currentPage = Math.min(Math.max(rawPage, 1), totalPages);

  const pageRows = MOCK_ROWS.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const handleApprove = (id: number) => console.log('approve', id);
  const handleReject = (id: number) => console.log('reject', id);

  return (
    <>
      <section className="w-full">
        <h1 className="mb-4 text-xl font-semibold text-gray-black">컬러 팔레트</h1>
        <div className="w-full rounded-lg bg-white shadow p-6 space-y-2">
          <h3 className="text-xs font-medium text-gray-40 mb-6">
            배경색 ( bg- 로 시작 ) / 폰트색 ( font- 로 시작 )
          </h3>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Primary</h2>
            <div className="flex flex-wrap gap-x-3 gap-y-4">
              <ColorChip name="primary" className="bg-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Gray</h2>
            <div className="flex flex-wrap gap-x-3 gap-y-4">
              <ColorChip name="gray-black" className="bg-gray-black" />
              <ColorChip name="gray-50" className="bg-gray-50" />
              <ColorChip name="gray-40" className="bg-gray-40" />
              <ColorChip name="gray-30" className="bg-gray-30" />
              <ColorChip name="gray-20" className="bg-gray-20" />
              <ColorChip name="gray-10" className="bg-gray-10" />
              <ColorChip name="gray-5" className="bg-gray-5" />
              <ColorChip name="white" className="bg-white border border-gray-20" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Red</h2>
            <div className="flex flex-wrap gap-x-3 gap-y-4">
              <ColorChip name="red-40" className="bg-red-40" />
              <ColorChip name="red-30" className="bg-red-30" />
              <ColorChip name="red-20" className="bg-red-20" />
              <ColorChip name="red-10" className="bg-red-10" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Blue</h2>
            <div className="flex flex-wrap gap-x-3 gap-y-4">
              <ColorChip name="blue-20" className="bg-blue-20" />
              <ColorChip name="blue-10" className="bg-blue-10" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Green</h2>
            <div className="flex flex-wrap gap-x-3 gap-y-4">
              <ColorChip name="green-20" className="bg-green-20 text-white" />
              <ColorChip name="green-10" className="bg-green-10" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-50">Kakao</h2>
            <div className="flex flex-wrap gap-3">
              <ColorChip name="kakao" className="bg-kakao" />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full">
        <h1 className="mb-4 text-xl font-semibold text-gray-black">폰트 크기</h1>
        <div className="w-full rounded-lg bg-white shadow p-6 space-y-6">
          <h3 className="text-xs font-medium text-gray-40 mb-6">
            폰트 ( tj- 로 시작 ) - the julge 줄임
          </h3>
          <div>
            <h1 className="tj-h1">제목 / Heading 1</h1>
            <p className="text-sm font-semibold text-gray-50">tj-h1</p>
          </div>

          <div>
            <h2 className="tj-h2">제목 / Heading 2</h2>
            <p className="text-sm font-semibold text-gray-50">tj-h2</p>
          </div>

          <div>
            <h3 className="tj-h3">제목 / Heading 3</h3>
            <p className="text-sm font-semibold text-gray-50">tj-h3</p>
          </div>

          <div>
            <p className="tj-body1-bold">본문 1 / Body 1 Bold</p>
            <p className="text-sm font-semibold text-gray-50">tj-body1-bold</p>
          </div>

          <div>
            <p className="tj-body1">본문 1 / Body 1</p>
            <p className="text-sm font-semibold text-gray-50">tj-body1</p>
          </div>

          <div>
            <p className="tj-body2-bold">본문 2 / Body 1 bold</p>
            <p className="text-sm font-semibold text-gray-50">tj-body2-bold</p>
          </div>

          <div>
            <p className="tj-body2">본문 2 / Body 1</p>
            <p className="text-sm font-semibold text-gray-50">tj-body2</p>
          </div>

          <div>
            <p className="tj-caption">캡션 텍스트 / Caption</p>
            <p className="text-sm font-semibold text-gray-50">tj-caption</p>
          </div>
        </div>
      </section>
      <section className="w-full">
        <h1 className="mb-4 text-xl font-semibold text-gray-black">컴포넌트</h1>
        <div className="w-full rounded-lg bg-white shadow p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-50">Table</h2>

            <Table rows={pageRows} onApprove={handleApprove} onReject={handleReject} />

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hrefBuilder={(p) => `?page=${p}`}
                  maxPageButtons={7}
                  mode="full"
                />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-50">Filter</h2>
            <Filter />
          </div>
        </div>
      </section>
    </>
  );
}

type ColorChipProps = {
  name: string;
  className?: string;
};

function ColorChip({ name, className = '' }: ColorChipProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className={`h-10 w-24 rounded-md border border-gray-20 ${className}`} />
      <span className="text-xs text-gray-50">{name}</span>
    </div>
  );
}
