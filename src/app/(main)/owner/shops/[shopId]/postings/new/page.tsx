'use client';

import Button from '@/components/common/Button';
import FormInput from '@/components/common/FormInput';
import FormTextarea from '@/components/common/FormTextarea';
import Image from 'next/image';
import { createNotice } from '@/api/notices';
import { useModalContext } from '@/components/modal/ModalProvider';
import { useRouter } from 'next/navigation';

import { FormProvider, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postingSchema, type PostingFormValues } from '@/feature/postings/newPosting/schema';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { getUser } from '@/api/users';

type CreateNoticePayload = {
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
};

export default function NewPostingPage() {
  const router = useRouter();
  const { openCustom } = useModalContext();
  const userId = useAuthStore((state) => state.user?.id);

  const [shopId, setShopId] = useState<string | null>(null);
  const [shopError, setShopError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchShop(id: string) {
      try {
        setShopError(null);
        const res = await getUser(id);
        const shopItem = res.data?.item?.shop?.item;

        if (!shopItem?.id) {
          setShopError('등록된 가게가 없습니다. 먼저 가게를 등록해 주세요.');
          return;
        }
        setShopId(shopItem.id);
      } catch (err) {
        console.error(err);
        setShopError('가게 정보를 불러오지 못했습니다.');
      }
    }

    fetchShop(userId);
  }, [userId, setShopError, setShopId]);

  const methods = useForm<PostingFormValues>({
    resolver: zodResolver(postingSchema) as Resolver<PostingFormValues>,
    mode: 'onChange',
    defaultValues: {
      startsAt: '',
      description: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const showPostingSuccessModal = () => {
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
    if (!userId || !shopId) {
      console.error('shopId가 없습니다. shopId를 가져오는 로직을 확인해주세요.');
      setShopError('가게 정보를 불러오지 못해 공고를 등록할 수 없습니다.');
      return;
    }

    const payload: CreateNoticePayload = {
      hourlyPay: data.hourlyPay,
      // date input 값(YYYY-MM-DD)을 RFC3339 형태로 변환
      startsAt: new Date(data.startsAt).toISOString(),
      workhour: data.workhour,
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
        className="flex flex-col justify-center w-full max-w-[964px] px-6 gap-[32px]"
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

          {/* 공고 설명 */}
          <FormTextarea<PostingFormValues>
            name="description"
            label="공고 설명"
            placeholder="공고 내용을 입력해주세요."
          />
        </div>

        {(!userId || shopError) && (
          <p className="text-sm text-red-500">
            {shopError ?? '로그인 정보가 없어 가게를 찾을 수 없습니다.'}
          </p>
        )}

        {/* 버튼 영역 */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={!isValid || isSubmitting || !userId || !shopId}
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
