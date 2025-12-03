'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/components/common/Button';
import FormInput from '@/components/common/FormInput';
import FormTextarea from '@/components/common/FormTextarea';
import Dropdown from '@/components/common/Dropdown';

import { useModalContext } from '@/components/modal/ModalProvider';
import { FormProvider, useForm, type Resolver, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormValues } from '@/feature/profile/newProfile/schema';
import { AREAS } from '@/constants/areas';
import { useAuth } from '@/contexts/AuthContext';
import { getUser, updateUser } from '@/api/users';
import type { UserDetailResponse } from '@/types/user';

// ----- 타입 가드 ----- //
function isUserDetailResponse(data: unknown): data is UserDetailResponse {
  if (!data || typeof data !== 'object') return false;

  const obj = data as { item?: unknown };
  if (!obj.item || typeof obj.item !== 'object') return false;

  const item = obj.item as {
    id?: unknown;
    email?: unknown;
    type?: unknown;
  };

  const isString = (v: unknown): v is string => typeof v === 'string';

  if (!isString(item.id) || !isString(item.email)) return false;
  if (item.type !== 'employee' && item.type !== 'employer') return false;

  return true;
}

export default function EditProfilePage() {
  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormValues>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      region: '',
      description: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = methods;

  const { user } = useAuth();
  const router = useRouter();
  const { openCustom } = useModalContext();

  const [isInitialLoading, setIsInitialLoading] = useState(false);

  // ----- 기존 프로필 불러오기 ----- //
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        setIsInitialLoading(true);

        const res = await getUser(String(user.id));
        const data = res.data;

        if (!isUserDetailResponse(data)) {
          console.error('예상치 못한 사용자 응답 형식입니다.', data);
          return;
        }

        const me = data.item;

        // 서버에 저장된 address(label) → 폼에서 사용하는 region(value)로 매핑
        const regionValue =
          me.address ? AREAS.find((area) => area.label === me.address)?.value ?? '' : '';

        reset({
          name: me.name ?? '',
          phone: me.phone ?? '',
          region: regionValue,
          description: me.bio ?? '',
        });
      } catch (error) {
        console.error('프로필 정보를 불러오지 못했습니다:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    void fetchProfile();
  }, [user, reset]);

  const showProfileSuccessModal = () => {
    openCustom((close) => (
      <div className="flex w-full flex-col justify-center items-center relative">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[18px] text-center text-gray-black px-[162px] py-[108px]">
            편집이 완료되었습니다.
          </p>
        </div>

        <div className="flex justify-end w-full">
          <Button
            type="button"
            size="medium"
            onClick={() => {
              close();
              router.push('/member');
            }}
            className="absolute right-3 bottom-3 px-[46px] py-[14px] rounded-[8px]"
          >
            확인
          </Button>
        </div>
      </div>
    ));
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (!user) {
        console.error('로그인 정보가 없습니다. 내 프로필 편집은 로그인 후 이용 가능합니다.');
        return;
      }

      const payload = {
        name: data.name,
        phone: data.phone, // zod transform으로 하이픈 제거된 숫자 문자열이라고 가정
        address: AREAS.find((a) => a.value === data.region)?.label,
        bio: data.description,
      };

      await updateUser(String(user.id), payload);
      showProfileSuccessModal();
    } catch (error) {
      console.error('프로필 수정 실패:', error);
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
          <span className="tj-h1">내 프로필</span>
          <button type="button" onClick={() => router.back()}>
            <Image src="/icons/icon-close-filter.svg" alt="닫기 아이콘" width={32} height={32} />
          </button>
        </div>

        {/* 폼 영역 */}
        <div className="flex flex-col gap-[24px]">
          {/* 이름 / 연락처 / 선호 지역 */}
          <div className="flex gap-[20px]">
            <div className="flex-1">
              <FormInput<ProfileFormValues> name="name" label="이름*" placeholder="입력" />
            </div>

            <div className="flex-1">
              <FormInput<ProfileFormValues>
                name="phone"
                label="연락처*"
                placeholder="입력"
                inputMode="numeric"
                numericOnly
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-2">
                <label>선호 지역*</label>
                <Controller
                  name="region"
                  control={methods.control}
                  render={({ field: { value, onChange } }) => (
                    <Dropdown
                      options={AREAS}
                      value={value}
                      onChange={onChange}
                      placeholder="선택"
                      size="large"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* 소개 */}
          <FormTextarea<ProfileFormValues> name="description" label="소개*" placeholder="입력" />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center">
          <Button type="submit" disabled={isInitialLoading || !isValid || isSubmitting}>
            {isSubmitting ? '편집 중...' : '편집하기'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
