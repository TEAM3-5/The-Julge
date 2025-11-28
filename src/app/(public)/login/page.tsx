'use client';

import Button from '@/components/e/Button';
import FormInput from '@/components/e/FormInput';
import Image from 'next/image';
import Link from 'next/link';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/feature/auth/login/schema';
import { login, parseLoginResponse } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useEffect } from 'react';
import { getRedirectPathByRole } from '@/utils/auth';

// ✅ 모달 컨텍스트 import
import { useModalContext } from '@/components/modal/ModalProvider';

export default function LoginPage() {
  const router = useRouter();
  const { openConfirm, openCustom } = useModalContext(); // ✅ 로그인 실패 시 모달 열기용

  const { user, setAuth } = useAuthStore((state) => ({
    user: state.user,
    setAuth: state.setAuth,
  }));

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!user) return;

    router.replace(getRedirectPathByRole(user.role));
  }, [user, router]);

  const onSubmit = async (data: LoginFormValues) => {
    const showLoginErrorModal = () => {
      openCustom((close) => (
        <div className="flex w-full flex-col justify-center items-center relative">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[18px] text-center text-gray-black px-[162px] py-[108px]">
              비밀번호가 일치하지 않습니다.
            </p>
          </div>

          <div className="flex justify-end w-full">
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

    try {
      const res = await login({
        email: data.email,
        password: data.password,
      });

      const parsed = parseLoginResponse(res);

      if (!parsed) {
        // ✅ 토큰/유저 정보가 안 오면 (대부분 이메일/비밀번호 불일치)
        showLoginErrorModal();
        return;
      }

      // ✅ 로그인 성공
      setAuth(parsed.user, parsed.token);
      router.push(getRedirectPathByRole(parsed.user.role));
    } catch (error) {
      console.error(error);
      // ✅ 네트워크/서버 에러 등 모든 예외 상황에서 공통 모달
      showLoginErrorModal();
    }
  };

  const {
    formState: { isSubmitting, isValid }, // ✅ errors 제거 (root 에러를 더 이상 사용하지 않음)
  } = methods;

  return (
    <main className="flex min-h-screen items-center justify-center">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            {/* 로고 */}
            <div className="flex justify-center items-center mb-8">
              <Link href="/">
                <Image src="/images/logo.svg" alt="로고" width={248} height={45} />
              </Link>
            </div>

            {/* 입력 폼 */}
            <div className="flex flex-col gap-7">
              <FormInput<LoginFormValues>
                name="email"
                label="이메일"
                placeholder="입력"
                type="email"
              />
              <FormInput<LoginFormValues>
                name="password"
                label="비밀번호"
                placeholder="입력"
                type="password"
              />
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? '로그인 중...' : '로그인 하기'}
              </Button>
            </div>
          </div>

          <p className="flex justify-center items-center">
            <span>회원이 아니신가요?&nbsp;</span>
            <Link href="/signup" className="underline text-violet">
              회원가입하기
            </Link>
          </p>
        </form>
      </FormProvider>
    </main>
  );
}
