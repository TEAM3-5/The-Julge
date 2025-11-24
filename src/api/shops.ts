import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';

// 가게 생성
export const createShop = (body: unknown) => http.post(ENDPOINTS.shops.list, body);

// 가게 상세 조회
export const getShop = (shopId: string) => http.get(ENDPOINTS.shops.detail(shopId));

// 가게 수정
export const updateShop = (shopId: string, body: unknown) =>
  http.put(ENDPOINTS.shops.detail(shopId), body);
