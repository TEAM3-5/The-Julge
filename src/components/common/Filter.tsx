'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AREAS } from '@/constants/areas';
import Input from '@/components/common/Input';
// import DateInput from '@/components/date/DateInput';
type FilterProps = {
  onClose?: () => void;
  initialAddresses?: string[];
  initialStartsAt?: string;
  initialHourlyPayGte?: string;
  onApply?: (values: { addresses: string[]; startsAt: string; hourlyPayGte: string }) => void;
};

export default function Filter({
  onClose,
  initialAddresses = [],
  initialStartsAt = '',
  initialHourlyPayGte = '',
  onApply,
}: FilterProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(initialAddresses);
  const [startsAt, setStartsAt] = useState<string>(initialStartsAt);
  const [hourlyPay, setHourlyPay] = useState<string>(initialHourlyPayGte);

  const handleSelectArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => area !== a) : [...prev, area],
    );
  };

  const handleRemoveArea = (area: string) => {
    setSelectedAreas((prev) => prev.filter((a) => area !== a));
  };

  return (
    <div className="rounded-[10px] py-[24px] px-[20px] w-full max-w-[390px] shadow-xl bg-white">
      <div className="flex justify-between items-center mb-[24px]">
        <h2 className="tj-h3">상세필터</h2>
        <button onClick={onClose} aria-label="닫기">
          <Image src="/icons/icon-close-filter.svg" alt="요소 제거" width={24} height={24} />
        </button>
      </div>
      <div className="flex flex-col gap-y-[24px]">
        <section className="flex flex-col gap-y-[12px]">
          <h3 className="th-body1">위치</h3>
          <div className="border border-gray-20 rounded-[6px] grid grid-cols-2 gap-x-[20px] gap-y-[12px] py-[16px] px-[10px] max-h-[258px] overflow-y-scroll">
            {AREAS.map((area) => {
              const isSelected = selectedAreas.includes(area.value);

              return (
                <button
                  key={area.value}
                  onClick={() => handleSelectArea(area.value)}
                  className={`rounded-full px-[12px] py-[4px] border transition text-left ${isSelected ? 'border-primary text-primary' : 'border-white hover:bg-gray-10'}`}
                >
                  {area.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {selectedAreas.map((area) => (
              <div
                key={area}
                className="bg-red-10 text-primary flex rounded-full justify-between items-center gap-[4px] min-w-[128px] py-[6px] px-[10px]"
              >
                <span className="tj-body2-bold">
                  {AREAS.find((opt) => opt.value === area)?.label ?? area}
                </span>
                <button onClick={() => handleRemoveArea(area)}>
                  <Image
                    src="/icons/icon-close-element.svg"
                    alt="요소 제거"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-y-[12px]">
          <Input
            id="filter-starts-at"
            label="시작일"
            type="date"
            placeholder="입력"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="flex-1"
          />
        </section>
        <section className="flex flex-col gap-y-[12px]">
          <div className="flex items-center gap-3">
            <Input
              id="filter-hourly-pay"
              label="금액"
              type="number"
              placeholder="입력"
              value={hourlyPay}
              onChange={(e) => setHourlyPay(e.target.value)}
              unit="원"
              className="flex-1"
            />
            <span className="mt-7 text-gray-50">이상부터</span>
          </div>
        </section>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex-1 h-12 rounded-md border border-red-30 text-red-40 tj-body1-bold"
            onClick={() => {
              setSelectedAreas([]);
              setHourlyPay('');
            }}
          >
            초기화
          </button>
          <button
            type="button"
            className="flex-1 h-12 rounded-md bg-red-40 text-white tj-body1-bold"
            onClick={() => {
              onApply?.({
                addresses: selectedAreas,
                startsAt,
                hourlyPayGte: hourlyPay,
              });
              onClose?.();
            }}
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
