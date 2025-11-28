'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AREAS } from '@/constants/areas';
// import Input from '@/components/common/Input';
// import DateInput from '@/components/date/DateInput';
export default function Filter() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

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
        <button>
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
        <section className="flex flex-col gap-y-[12px]">{/* <DateInput /> */}</section>
        <section className="flex flex-col gap-y-[12px]">
          <h3 className="th-body1">금액</h3>
          <div>
            {/* <Input label="" value={amount} onChange={(e) => setAmount(e.target.value)} showUnit /> */}
          </div>
        </section>
      </div>
    </div>
  );
}
