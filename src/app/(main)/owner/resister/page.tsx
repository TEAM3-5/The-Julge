'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch, type Resolver } from 'react-hook-form';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import Input from '@/components/common/Input';
import { createShop } from '@/api/shops';
import { AREAS } from '@/constants/areas';
import type { ShopCreatePayload } from '@/types/shop';
import { shopRegisterSchema, type ShopFormValues } from '@/feature/shops/schema';
import { useToast } from '@/components/toast/toastProvider';
import { useAuthStore } from '@/stores/auth';
import { setAuthToken } from '@/lib/api';

const CATEGORIES = [
  { value: '한식', label: '한식' },
  { value: '중식', label: '중식' },
  { value: '일식', label: '일식' },
  { value: '양식', label: '양식' },
  { value: '분식', label: '분식' },
];

export default function ShopRegisterPage() {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ShopFormValues>({
    resolver: zodResolver(shopRegisterSchema) as Resolver<ShopFormValues>,
    defaultValues: {
      name: '',
      category: '',
      address1: '',
      address2: '',
      description: '',
      imageUrl: '',
      originalHourlyPay: 0,
      imageFile: undefined,
    },
    mode: 'onChange',
  });

  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  // API에서 주소는 한글 시군구 전체 문자열을 요구하므로 value/label을 동일하게 사용
  const areaOptions = useMemo(
    () => AREAS.map((opt) => ({ value: opt.label, label: opt.label })),
    [],
  );
  const imageUrl = useWatch({ control, name: 'imageUrl' });

  const onSubmit = async (data: ShopFormValues) => {
    setSubmittingError(null);
    setSuccess(null);

    const imageUrl = data.imageUrl?.trim();

    const payload: ShopCreatePayload = {
      name: data.name,
      category: data.category,
      address1: data.address1,
      address2: data.address2,
      description: data.description ?? '',
      imageUrl: imageUrl && imageUrl.length > 0 ? imageUrl : 'https://via.placeholder.com/400',
      originalHourlyPay: data.originalHourlyPay ?? 0,
    };

    try {
      await createShop(payload);
      setSuccess('가게가 등록되었습니다.');
      showToast('가게가 등록되었습니다.', { variant: 'success' });
    } catch (err: unknown) {
      const status = isAxiosError(err) ? err.response?.status : undefined;
      const respData = isAxiosError(err) ? err.response?.data : undefined;
      console.error('가게 등록 실패', status, respData);
      if (status === 409) {
        setSubmittingError('이미 등록한 가게가 있습니다.');
        showToast('이미 등록한 가게가 있습니다.', { variant: 'error' });
      } else if (status === 401) {
        setSubmittingError('로그인이 필요합니다. 다시 로그인해주세요.');
        showToast('로그인이 필요합니다. 다시 로그인해주세요.', { variant: 'error' });
      } else {
        setSubmittingError('가게 등록에 실패했습니다.');
        showToast('가게 등록에 실패했습니다.', { variant: 'error' });
      }
    }
  };

  const handlePickImage = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setValue('imageFile', file);
    setValue('imageUrl', objectUrl);
  };

  return (
    <main className="flex w-full justify-center bg-gray-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-[900px] flex-col gap-8 px-6 py-10"
        noValidate
      >
        <div className="flex items-center justify-between">
          <h1 className="tj-h1 text-gray-black">가게 정보</h1>
          <Image
            src="/icons/icon-close-filter.svg"
            alt="닫기"
            width={32}
            height={32}
            className="cursor-pointer"
            onClick={() => history.back()}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <LabeledInput label="가게 이름*" error={errors.name?.message}>
            <Input
              id="shop-name"
              placeholder="입력"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
          </LabeledInput>

          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <LabeledDropdown
                label="분류*"
                placeholder="선택"
                options={CATEGORIES}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                error={errors.category?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="address1"
            render={({ field }) => (
              <LabeledDropdown
                label="주소*"
                placeholder="선택"
                options={areaOptions}
                value={field.value}
                onChange={(val) => field.onChange(val)}
                error={errors.address1?.message}
              />
            )}
          />

          <LabeledInput label="상세 주소*" error={errors.address2?.message}>
            <Input
              id="address2"
              placeholder="입력"
              {...register('address2')}
              aria-invalid={!!errors.address2}
            />
          </LabeledInput>

          <LabeledInput label="기본 시급*" suffix="원" error={errors.originalHourlyPay?.message}>
            <Input
              id="base-pay"
              type="number"
              inputMode="numeric"
              placeholder="10,000"
              {...register('originalHourlyPay', { valueAsNumber: true })}
              aria-invalid={!!errors.originalHourlyPay}
            />
          </LabeledInput>
        </div>

        <div className="flex flex-col gap-3">
          <span className="tj-body2 text-gray-black">가게 이미지</span>
          {imageUrl ? (
            <div className="relative h-[200px] md:h-[310px] w-full max-w-[483px] overflow-hidden rounded-xl border border-gray-30 bg-gray-10">
              <Image
                src={imageUrl}
                alt="가게 이미지"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/dotori.svg';
                }}
              />
            </div>
          ) : (
            <div className="flex h-[200px] md:h-[310px] w-full max-w-[483px] items-center justify-center rounded-xl border border-gray-30 bg-gray-10 text-gray-40">
              <button
                type="button"
                onClick={handlePickImage}
                className="flex flex-col items-center gap-[11px]"
              >
                <Image src="/icons/icon-photo.png" alt="" width={32} height={32} />
                <p className="tj-body1-bold">이미지 추가하기</p>
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="tj-body2 text-gray-black">가게 설명</span>
          <textarea
            placeholder="입력"
            {...register('description')}
            className="min-h-[150px] rounded-md border border-gray-20 bg-white px-4 py-3 text-sm text-gray-black focus:border-primary focus:outline-none"
          />
          {errors.description && (
            <p className="text-xs text-red-40">{errors.description.message}</p>
          )}
        </div>

        {submittingError && <p className="text-sm text-red-40">{submittingError}</p>}
        {success && <p className="text-sm text-green-20">{success}</p>}

        <div className="flex justify-center">
          <Button type="submit" disabled={isSubmitting} className="px-16">
            {isSubmitting ? '등록 중...' : '등록하기'}
          </Button>
        </div>
      </form>
    </main>
  );
}

type LabeledInputProps = {
  label: string;
  placeholder?: string;
  children: React.ReactNode;
  suffix?: string;
  error?: string;
};

function LabeledInput({ label, placeholder, children, suffix, error }: LabeledInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="tj-body2 text-gray-black">{label}</span>
      <div className="relative">
        {children}
        {placeholder}
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-50">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-40">{error}</p>}
    </div>
  );
}

type LabeledDropdownProps = {
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (val: string) => void;
  error?: string;
};

function LabeledDropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}: LabeledDropdownProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="tj-body2 text-gray-black">{label}</span>
      <Dropdown
        size="large"
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-xs text-red-40">{error}</p>}
    </div>
  );
}
