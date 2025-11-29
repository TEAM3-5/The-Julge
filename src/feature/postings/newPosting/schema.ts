import { z } from 'zod';

const MIN_HOURLY_PAY = 10320;

export const postingSchema = z.object({
  hourlyPay: z.coerce
    .number()
    // 숫자로 변환 실패(숫자 아님/빈 문자열 등) 처리
    .refine((value) => !Number.isNaN(value), {
      message: '시급은 숫자만 입력해주세요.',
    })
    .min(MIN_HOURLY_PAY, {
      message: `현재 최저시급은 ${MIN_HOURLY_PAY}원입니다`,
    }),

  startsAt: z
    .string()
    .nonempty('시작 일시를 선택해주세요.')
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: '유효한 날짜를 선택해주세요.',
    }),

  workhour: z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: '업무 시간은 숫자만 입력해주세요.',
    })
    .min(1, {
      message: '올바른 업무 시간을 입력해주세요.',
    })
    .max(24, {
      message: '업무 시간은 24시간을 초과할 수 없습니다.',
    }),

  description: z.string().min(1, '설명을 입력해주세요.'),
});

export type PostingFormValues = z.infer<typeof postingSchema>;
