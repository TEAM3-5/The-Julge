'use client';

import Button from '@/components/common/Button';
import FormInput from '@/components/common/FormInput';
import Image from 'next/image';
import Link from 'next/link';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/feature/auth/login/schema';

export default function LoginPage() {
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log('로그인 폼 제출 값:', data);
    // TODO: 여기서 실제 로그인 API 호출하면 됨
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <div className="flex justify-center items-center mb-8">
              <Link href="/">
                <Image src="/images/logo.svg" alt="로고" width={248} height={45} />
              </Link>
            </div>

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
              <Button type="submit">로그인 하기</Button>
            </div>
          </div>

          <p className="flex justify-center items-center">
            <span>회원이 아니신가요?&nbsp;</span>
            <Link href="/signup" className="underline text-[#5534DA]">
              회원가입하기
            </Link>
          </p>
        </form>
      </FormProvider>
    </main>
  );
}
