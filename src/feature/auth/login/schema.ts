import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().nonempty('이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),

  password: z.string().nonempty('비밀번호를 입력해주세요.').min(8, '8자 이상 입력해주세요.'),
});

// loginSchema 안에 정의된 구조를 TypeScript 타입으로 변환해서 LoginFormValues의 타입으로 내보내기
export type LoginFormValues = z.infer<typeof loginSchema>;
