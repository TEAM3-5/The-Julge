'use client';

import Button from '@/components/common/Button';
import FormInput from '@/components/common/FormInput';
import Image from 'next/image';
import Link from 'next/link';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/feature/auth/login/schema';
import { login, parseLoginResponse } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore((state) => ({
    user: state.user,
    setAuth: state.setAuth,
  }));

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // ✅ 입력이 바뀔 때마다 유효성 검사
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getRedirectPath = (role: 'owner' | 'member') => (role === 'owner' ? '/owner' : '/member');

  useEffect(() => {
    if (!user) return;

    router.replace(getRedirectPath(user.role));
  }, [user, router]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // 로그인 API 요청
      const res = await login({
        email: data.email,
        password: data.password,
      });

      // 응답 파싱 (token + user)
      const parsed = parseLoginResponse(res);

      if (!parsed) {
        // 토큰/유저가 안 온 경우
        methods.setError('root', {
          type: 'server',
          message: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
        });
        return;
      }

      // zustand 전역 상태 + axios 헤더에 토큰 반영
      setAuth(parsed.user, parsed.token);
      // role에 따라 라우팅
      router.push(getRedirectPath(parsed.user.role));
    } catch (error) {
      console.error(error);
      // 서버/네트워크 에러 or 401 등
      methods.setError('root', {
        type: 'server',
        message: '이메일 또는 비밀번호를 다시 확인해주세요.',
      });
    }
  };

  const {
    formState: { errors, isSubmitting, isValid }, // ✅ isValid 추가
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

            {/* 서버에서 온 공통 에러 (이메일/비번 틀림 등) */}
            {errors.root?.message && (
              <p className="text-center mt-3 text-tj-caption text-red-40">{errors.root.message}</p>
            )}
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
