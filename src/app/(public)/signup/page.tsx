'use client';

import Button from '@/components/common/Button';
import FormInput from '@/components/common/FormInput';
import Image from 'next/image';
import Link from 'next/link';

// [수정] Controller 추가, 사용하지 않는 import 제거(getUser, updateUser, MemberTypeValue, useState)
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '@/feature/auth/signup/schema';
import { createUser } from '@/api/users';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useEffect } from 'react';
import MemberTypeRadioBtn from '@/components/signup/MemberTypeRadioBtn';
import { getRedirectPathByRole } from '@/utils/auth';
import { useModalContext } from '@/components/modal/ModalProvider';
import { AxiosError } from 'axios';

const mapMemberTypeToApiType = (memberType: 'member' | 'owner'): 'employee' | 'employer' => {
  return memberType === 'member' ? 'employee' : 'employer';
};

export default function SignupPage() {
  const router = useRouter();
  const { openCustom } = useModalContext();

  // [수정] setAuth는 이 페이지에서 사용하지 않으므로 제거
  const user = useAuthStore((state) => state.user);

  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange', // [수정] 버튼 활성화를 위해 onChange 시점에 유효성 검사
    // [수정] passwordConfirm, memberType 기본값 추가 (알바님 기본 선택)
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      memberType: 'member',
    },
  });

  // [수정] 로그인 상태라면 회원가입 페이지 접근 시 리다이렉트 (기존 로직 유지하되 user만 사용)
  useEffect(() => {
    if (!user) return;

    router.replace(getRedirectPathByRole(user.role));
  }, [user, router]);

  const showDuplicateEmailModal = () => {
    openCustom((close) => (
      <div className="flex w-full flex-col justify-center items-center relative">
        <div className="flex flex-col items-center gap-4 ">
          <p className="text-[18px] text-center text-gray-black px-[162px] py-[108px]">
            이미 사용중인 이메일입니다.
          </p>
        </div>

        <div className="flex w-full">
          <Button
            type="button"
            size="medium"
            onClick={close}
            className="absolute right-3 bottom-3 px-[46px] py-[14px] rounded-[8px]"
          >
            확인
          </Button>
        </div>
      </div>
    ));
  };
  const showSignupErrorModal = (message: string) => {
    openCustom((close) => (
      <div className="flex w-[540px] flex-col justify-center items-center relative">
        <div className="flex flex-col items-center gap-4 px-[60px] py-[48px]">
          <p className="text-[18px] text-center text-gray-black">{message}</p>
        </div>

        <div className="flex w-full">
          <Button
            type="button"
            size="medium"
            onClick={close}
            className="absolute right-3 bottom-3 px-[46px] py-[14px] rounded-[8px]"
          >
            확인
          </Button>
        </div>
      </div>
    ));
  };

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // 회원가입 API 요청
      await createUser({
        email: data.email,
        password: data.password,
        type: mapMemberTypeToApiType(data.memberType),
      });

      // 회원가입 성공 시 alert 후, 로그인 페이지로 이동
      alert('가입이 완료되었습니다.');
      router.push('/login');
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError) {
        const status = error.response?.status;

        switch (status) {
          case 409:
            showDuplicateEmailModal();
            return;
          case 400:
            showSignupErrorModal('입력 정보를 다시 확인해 주세요.');
            return;
          default:
            showSignupErrorModal('잠시 후 다시 시도해 주세요.');
            return;
        }
      }
    }
  };

  const {
    formState: { isSubmitting, isValid },
  } = methods;

  return (
    <main className="flex min-h-screen items-center justify-center">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            {/* 로고 */}
            <div className="flex justify-center items-center mb-8">
              <Link href="/posts">
                <Image src="/images/logo.svg" alt="로고" width={248} height={45} />
              </Link>
            </div>

            {/* 입력 폼 */}
            <div className="flex flex-col gap-7">
              <FormInput<SignupFormValues>
                name="email"
                label="이메일"
                placeholder="입력"
                type="email"
              />
              <FormInput<SignupFormValues>
                name="password"
                label="비밀번호"
                placeholder="입력"
                type="password"
              />
              <FormInput<SignupFormValues>
                name="passwordConfirm"
                label="비밀번호 확인"
                placeholder="입력"
                type="password"
              />

              {/* [수정] memberType을 RHF와 연결: Controller를 통해 MemberTypeRadioBtn 제어 */}
              <Controller
                name="memberType"
                control={methods.control}
                render={({ field }) => (
                  <MemberTypeRadioBtn selectedValue={field.value} onChange={field.onChange} />
                )}
              />

              <Button
                type="submit"
                disabled={!isValid || isSubmitting} // [수정] 폼이 유효하지 않거나 제출 중이면 비활성화
              >
                {isSubmitting ? '처리 중...' : '가입하기'}
              </Button>
            </div>
          </div>

          <p className="flex justify-center items-center">
            <span>이미 가입하셨나요?&nbsp;</span>
            <Link href="/login" className="underline text-violet">
              로그인하기
            </Link>
          </p>
        </form>
      </FormProvider>
    </main>
  );
}
