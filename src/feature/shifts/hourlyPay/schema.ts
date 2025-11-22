import { z } from 'zod';
import dayjs from 'dayjs';

const MIN_PAY_BY_YEAR: Record<number, number> = {
  2023: 9620,
  2024: 9860,
  2025: 10030,
  2026: 10320,
};
const currentYear = dayjs().year();
const minimumPay = MIN_PAY_BY_YEAR[currentYear] ?? 0;
const formattedMinimumPay = minimumPay.toLocaleString('ko-KR');

export const hourlyPaySchema = z.object({
  hourlyPay: z.coerce
    .number()
    .int('시급을 올바르게 입력해주세요.')
    .min(minimumPay, `${currentYear}년 최저시급(${formattedMinimumPay}원) 이상 입력해주세요.`)
    .max(1000000, '너무 큰 시급입니다.'),
});

export type HourlyPayFormValues = z.infer<typeof hourlyPaySchema>;
