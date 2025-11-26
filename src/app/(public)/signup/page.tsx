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

const mapMemberTypeToApiType = (memberType: 'member' | 'owner'): 'employee' | 'employer' => {
  return memberType === 'member' ? 'employee' : 'employer';
};

export default function SignupPage() {
  const router = useRouter();

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

  // [수정] 회원가입 로직: login 대신 createUser 사용, 성공 시 로그인 페이지로 이동
  const onSubmit = async (data: SignupFormValues) => {
    try {
      // 회원가입 API 요청
      await createUser({
        email: data.email,
        password: data.password,
        type: mapMemberTypeToApiType(data.memberType),
      });

      // 회원가입 성공 시 로그인 페이지로 이동
      router.push('/login');
    } catch (error) {
      console.error(error);
      // 서버/네트워크 에러
      methods.setError('root', {
        type: 'server',
        // [수정] 문구를 "회원가입" 기준으로 변경
        message: '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  const {
    formState: { errors, isSubmitting, isValid }, // [수정] isValid 추가
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

            {/* 서버에서 온 공통 에러 (이메일 중복, 서버 오류 등) */}
            {errors.root?.message && (
              <p className="text-center mt-3 text-tj-caption text-red-40">{errors.root.message}</p>
            )}
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
