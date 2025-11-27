import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Image from 'next/image';

export default function NewPosting() {
  return (
    <div className="flex flex-col w-full justify-center px-[238px] gap-[32px]">
      <div className="flex justify-between">
        <span className="tj-h1">공고 등록</span>
        <Image src="/icons/icon-close-filter.svg" alt="닫기 아이콘" width={32} height={32} />
      </div>
      <div className="flex flex-col gap-[24px]">
        <div className="flex gap-[20px]">
          <div className="flex-1">
            <Input
              id="hourlyPay"
              label="시급*"
              type="number"
              unit="원"
              inputMode="numeric"
              required
            />
          </div>
          <div className="flex-1">
            <Input id="startAt" label="시작 일시*" type="date" required />
          </div>
          <div className="flex-1">
            <Input
              id="workHour"
              label="업무 시간*"
              type="number"
              unit="시간"
              inputMode="numeric"
              required
            />
          </div>
        </div>
        <Textarea id="textarea" label="공고 설명" />
      </div>
      <div className="flex justify-center">
        <Button>등록하기</Button>
      </div>
    </div>
  );
}
