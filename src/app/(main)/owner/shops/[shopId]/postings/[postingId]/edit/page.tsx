'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/common/Button';
import FormInput from '@/components/common/FormInput';
import FormTextarea from '@/components/common/FormTextarea';
import Image from 'next/image';
import { useModalContext } from '@/components/modal/ModalProvider';

import { getNotice, updateNotice } from '@/api/notices';
import { postingSchema, type PostingFormValues } from '@/feature/postings/newPosting/schema';
import type { Notice } from '@/types/notice';

type EditNoticePayload = {
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
};

export default function EditPostingPage() {
  const router = useRouter();
  const { openCustom } = useModalContext();

  const params = useParams() as { shopId?: string | string[]; postingId?: string | string[] };

  const shopId = typeof params.shopId === 'string' ? params.shopId : (params.shopId?.[0] ?? '');
  const postingId =
    typeof params.postingId === 'string' ? params.postingId : (params.postingId?.[0] ?? '');

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<PostingFormValues>({
    resolver: zodResolver(postingSchema) as Resolver<PostingFormValues>,
    mode: 'onChange',
    defaultValues: {
      hourlyPay: undefined,
      startsAt: '',
      workhour: undefined,
      description: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  const showEditSuccessModal = () => {
    openCustom((close) => (
      <div className="flex w-full flex-col justify-center items-center relative">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[18px] text-center text-gray-black px-[162px] py-[108px]">
            공고가 성공적으로 수정되었습니다.
          </p>
        </div>

        <div className="flex justify-end w-full">
          <Button
            type="button"
            size="medium"
            onClick={() => {
              close();
              if (shopId && postingId) {
                router.push(`/owner/shops/${shopId}/postings/${postingId}`);
              } else if (shopId) {
                router.push(`/owner/shops/${shopId}`);
              } else {
                router.push('/owner');
              }
            }}
            className="absolute right-3 bottom-3 px-[46px] py-[14px] rounded-[8px]"
          >
            확인
          </Button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    if (!shopId || !postingId) {
      setErrorMessage('공고 정보가 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }

    async function fetchNotice() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const res = await getNotice(shopId, postingId);

        type NoticeResponse = Notice | { item: Notice };
        const data: NoticeResponse = res.data as NoticeResponse;
        const notice: Notice = 'item' in data ? data.item : data;

        // date input(type="date")에 맞게 YYYY-MM-DD 형식으로 변환
        const startsAtDate = new Date(notice.startsAt);
        const startsAtForInput = Number.isNaN(startsAtDate.getTime())
          ? ''
          : startsAtDate.toISOString().slice(0, 10);

        reset({
          hourlyPay: notice.hourlyPay,
          startsAt: startsAtForInput,
          workhour: notice.workhour,
          description: notice.description ?? '',
        });
      } catch (error) {
        console.error(error);
        setErrorMessage('공고 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotice();
  }, [shopId, postingId, reset]);

  const onSubmit = async (data: PostingFormValues) => {
    if (!shopId || !postingId) {
      setErrorMessage('공고 정보가 올바르지 않습니다.');
      return;
    }

    const payload: EditNoticePayload = {
      hourlyPay: data.hourlyPay,
      startsAt: new Date(data.startsAt).toISOString(),
      workhour: data.workhour,
      description: data.description,
    };

    try {
      await updateNotice(shopId, postingId, payload);
      showEditSuccessModal();
    } catch (error) {
      console.error('공고 수정 실패:', error);
      setErrorMessage('공고를 수정하는 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <main className="flex w-full justify-center">
        <section className="py-15 w-full max-w-[964px]">
          <p className="tj-body1 text-gray-50">공고 정보를 불러오는 중입니다...</p>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex w-full justify-center">
        <section className="py-15 w-full max-w-[964px] flex flex-col gap-4">
          <p className="tj-body1 text-red-500">{errorMessage}</p>
          <Button type="button" size="medium" onClick={() => router.back()}>
            이전 페이지로 돌아가기
          </Button>
        </section>
      </main>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col justify-center w-full max-w-[964px] px-6 gap-[32px]"
      >
        <div className="flex justify-between">
          <span className="tj-h1">공고 편집</span>
          <Image
            src="/icons/icon-close-filter.svg"
            alt="닫기 아이콘"
            width={32}
            height={32}
            onClick={() => router.back()}
            className="cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-[24px]">
          <div className="gap-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
              <FormInput<PostingFormValues> name="startsAt" label="시작 일시*" type="date" />
            </div>

            <div className="flex-1">
              <FormInput<PostingFormValues>
                name="workhour"
                label="업무 시간*"
                type="number"
                inputMode="numeric"
                unit="시간"
                placeholder="입력"
              />
            </div>
          </div>

          <FormTextarea<PostingFormValues>
            name="description"
            label="공고 설명"
            placeholder="공고 내용을 입력해주세요."
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="w-full md:w-auto" disabled={!isValid || isSubmitting}>
            {isSubmitting ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
