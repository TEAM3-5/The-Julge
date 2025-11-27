// src/app/(main)/owner/postings/new/page.tsx
'use client';

import Button from '@/components/common/Button';
import FormInput from '@/components/common/FormInput';
import FormTextarea from '@/components/common/FormTextarea';
import Image from 'next/image';
import { createNotice } from '@/api/notices';
import { useModalContext } from '@/components/modal/ModalProvider';
import { useRouter } from 'next/navigation';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postingSchema, type PostingFormValues } from '@/feature/postings/newPosting/schema';

type CreateNoticePayload = {
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
};

export default function NewPostingPage() {
  const methods = useForm<PostingFormValues>({
    resolver: zodResolver(postingSchema),
    mode: 'onChange',
    defaultValues: {
      hourlyPay: '',
      startAt: '',
      workHour: '',
      description: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const router = useRouter();
  const { openCustom } = useModalContext();

  // TODO: 실제 구현에 맞게 사장님 가게 ID를 가져오기
  const shopId = 'SHOP_ID_PLACEHOLDER';

  const showPostingSuccessModal = () => {
    console.log('✅ showPostingSuccessModal 호출됨');

    openCustom((close) => (
      <div className="flex w-full flex-col justify-center items-center relative">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[18px] text-center text-gray-black px-[162px] py-[108px]">
            공고가 성공적으로 등록되었습니다.
          </p>
        </div>

        <div className="flex justify-end w-full">
          <Button
            type="button"
            size="medium"
            onClick={() => {
              close();
              router.push('/owner');
            }}
            className="absolute right-3 bottom-3 px-[46px] py-[14px] rounded-[8px]"
          >
            확인
          </Button>
        </div>
      </div>
    ));
  };

  const onSubmit = async (data: PostingFormValues) => {
    if (!shopId) {
      console.error('shopId가 없습니다. shopId를 가져오는 로직을 확인해주세요.');
      return;
    }

    const payload: CreateNoticePayload = {
      hourlyPay: Number(data.hourlyPay),
      startsAt: data.startAt,
      workhour: Number(data.workHour),
      description: data.description,
    };

    try {
      await createNotice(shopId, payload);
      showPostingSuccessModal();
    } catch (error) {
      console.error('공고 등록 실패:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col w-full justify-center px-[238px] gap-[32px]"
      >
        {/* 상단 타이틀 + 닫기 아이콘 */}
        <div className="flex justify-between">
          <span className="tj-h1">공고 등록</span>
          <Image
            src="/icons/icon-close-filter.svg"
            alt="닫기 아이콘"
            width={32}
            height={32}
            onClick={() => router.back()}
            className="cursor-pointer"
          />
        </div>

        {/* 폼 영역 */}
        <div className="flex flex-col gap-[24px]">
          {/* 시급 / 시작 일시 / 업무 시간 */}
          <div className="flex gap-[20px]">
            <div className="flex-1">
              <FormInput<PostingFormValues>
                name="hourlyPay"
                label="시급*"
                type="number"
                inputMode="numeric"
                unit="원"
                placeholder="입력"
              />
            </div>

            <div className="flex-1">
              <FormInput<PostingFormValues> name="startAt" label="시작 일시*" type="date" />
            </div>

            <div className="flex-1">
              <FormInput<PostingFormValues>
                name="workHour"
                label="업무 시간*"
                type="number"
                inputMode="numeric"
                unit="시간"
                placeholder="입력"
              />
            </div>
          </div>

          {/* 공고 설명 */}
          <FormTextarea<PostingFormValues>
            name="description"
            label="공고 설명"
            placeholder="공고 내용을 입력해주세요."
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center">
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? '등록 중...' : '등록하기'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
