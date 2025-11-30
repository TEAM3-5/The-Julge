import { z } from 'zod';

export const shopRegisterSchema = z.object({
  name: z.string().min(1, '가게 이름을 입력해주세요.'),
  category: z.string().min(1, '분류를 선택해주세요.'),
  address1: z.string().min(1, '주소를 선택해주세요.'),
  address2: z.string().min(1, '상세 주소를 입력해주세요.'),
  description: z.string().optional(),
  imageUrl: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const t = val.trim();
        return t.length ? t : undefined;
      }
      return val;
    },
    z.string().url('이미지 URL이 올바르지 않습니다.').optional(),
  ),
  originalHourlyPay: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return 0;
      const num = Number(val);
      return Number.isNaN(num) ? 0 : num;
    },
    z.number().nonnegative('기본 시급은 0 이상이어야 합니다.'),
  ),
  imageFile: z.instanceof(File).optional(),
});

export type ShopFormValues = z.infer<typeof shopRegisterSchema>;
