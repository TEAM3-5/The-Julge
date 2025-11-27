import { z } from 'zod';

const MIN_HOURLY_PAY = 10320;

export const postingSchema = z.object({
  hourlyPay: z
    .string()
    .nonempty('시급을 입력해주세요.')
    .regex(/^\d+$/, '시급은 숫자만 입력해주세요.')
    .refine((value) => Number(value) >= MIN_HOURLY_PAY, {
      message: `현재 최저시급은 ${MIN_HOURLY_PAY}원입니다`,
    }),

  startAt: z.string().nonempty('시작 일시를 선택해주세요.').refine((val) => !isNaN(Date.parse(val)), { message: '유효한 날짜를 선택해주세요.' }),

  workHour: z
    .string()
    .nonempty('업무 시간을 입력해주세요.')
    .regex(/^\d+$/, '업무 시간은 숫자만 입력해주세요.')
    .refine((value) => Number(value) > 0 && Number(value) <= 24, {
      message: '올바른 업무 시간을 입력해주세요.',
    }),

  description: z.string().min(10, '공고 설명을 10자 이상 입력해주세요.'),
});

export type PostingFormValues = z.infer<typeof postingSchema>;
