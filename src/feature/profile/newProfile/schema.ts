import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  phone: z.string().min(1, '연락처를 입력해주세요.'),
  region: z.string().min(1, '선호 지역을 선택해주세요.'),
  description: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
