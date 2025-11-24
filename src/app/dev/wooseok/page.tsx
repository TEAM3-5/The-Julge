'use client';

import Button from '@/components/common/Button';
import FormInput from '@/components/common/FormInput'; // ✅ 새로 추가: 공통 FormInput 사용
import { FormProvider, useForm } from 'react-hook-form'; // ✅ react-hook-form 훅 import
import { zodResolver } from '@hookform/resolvers/zod'; // ✅ zodResolver import
// import { loginSchema, type LoginFormValues } from '@/feature/auth/login/schema'; // ✅ 로그인 스키마 + 타입 import
import { hourlyPaySchema, type HourlyPayFormValues } from '@/feature/shifts/hourlyPay/schema'; // ✅ 시급 스키마 + 타입 import
import { z } from 'zod';

export default function Home() {
  // ✅ 새로 추가: useForm으로 폼 세팅
  const methods = useForm({
    resolver: zodResolver(hourlyPaySchema), // ✅ zod 스키마 연결
    defaultValues: {
      hourlyPay: undefined,
    },
    mode: 'onBlur', // ✅ 처음 검증: blur 시
    reValidateMode: 'onBlur', // ✅ 이후에도 blur 기준으로 재검증
  });

  // ✅ 새로 추가: submit 핸들러 (지금은 콘솔에만 찍음)
  const onSubmit = (data: z.infer<typeof hourlyPaySchema>) => {
    console.log('시급 폼 데이터:', data);
  };

  return (
    // ✅ 새로 추가: FormProvider로 감싸서 하위에서 useFormContext 쓸 수 있게 함
    <FormProvider {...methods}>
      <main className="p-8 flex flex-col gap-10">
        <section className="flex flex-col gap-4 w-[360px]">
          <h1 className="text-lg font-bold">시급 input 테스트</h1>
          <form
            onSubmit={methods.handleSubmit(onSubmit)} // ✅ RHF submit 연결
            className="flex flex-col gap-4"
          >
            <FormInput<HourlyPayFormValues>
              name="hourlyPay"
              label="시급"
              type="number"
              placeholder="입력"
              unit="원"
            />
            <Button type="submit">콘솔 출력</Button>
          </form>
        </section>

        {/* ✅ 새로 추가: 로그인 폼 테스트 영역 */}
        {/* <section className="flex flex-col gap-4 w-[360px]">
          <h1 className="text-lg font-bold">로그인 폼 테스트</h1>
          <form
            onSubmit={methods.handleSubmit(onSubmit)} // ✅ RHF submit 연결
            className="flex flex-col gap-4"
          >
            <FormInput<LoginFormValues>
              name="email"
              label="이메일"
              type="email"
              placeholder="입력"
            />
            <FormInput<LoginFormValues>
              name="password"
              label="비밀번호"
              type="password"
              placeholder="입력"
            />
            <Button type="submit" className="mt-2">
              로그인 테스트
            </Button>
          </form>
        </section> */}

        <section className="flex flex-col gap-4">
          <h2 className="text-md font-semibold">버튼 샘플</h2>
          <div className="flex flex-col gap-2">
            <Button>로그인 하기</Button>
            <Button variant="outline">로그인 하기</Button>
            <Button disabled>신청 불가</Button>
            <Button variant="outline" size="medium">
              로그인 하기
            </Button>

            <Button size="medium">로그인 하기</Button>
            <Button size="medium" disabled>
              신청 불가
            </Button>

            <Button size="small" className="w-25">
              예
            </Button>
            <Button variant="outline" size="small" className="w-25">
              아니오
            </Button>
          </div>
        </section>
      </main>
    </FormProvider>
  );
}
