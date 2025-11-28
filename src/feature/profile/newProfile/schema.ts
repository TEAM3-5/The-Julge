import { z } from 'zod';
import { extractDigits, isValidPhone } from '@/utils/phone';

export const profileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),

  phone: z
    .string()
    .transform((v) => extractDigits(v)) // 하이픈 제거 + 숫자만 추출 + 11자리 제한
    .refine((digits) => isValidPhone(digits), {
      message: '유효한 전화번호 형식이 아닙니다.',
    }),

  region: z.string().min(1, '선호 지역을 선택해주세요.'),
  description: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
