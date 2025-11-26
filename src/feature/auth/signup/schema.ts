import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().nonempty('이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),

    password: z.string().nonempty('비밀번호를 입력해주세요.').min(8, '8자 이상 입력해주세요.'),

    passwordConfirm: z.string().nonempty('비밀번호를 한 번 더 입력해주세요.'),
    memberType: z.enum(['member', 'owner']),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'], // 이 필드에 에러를 달아줌
    message: '비밀번호가 일치하지 않습니다.',
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
