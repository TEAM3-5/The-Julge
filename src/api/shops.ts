import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';
import type { ShopCreatePayload, ShopUpdatePayload, ShopResponse } from '@/types/shop';

// 가게 생성
export const createShop = (body: ShopCreatePayload) => http.post<ShopResponse>(ENDPOINTS.shops.list, body);

// 가게 상세 조회
export const getShop = (shopId: string) => http.get<ShopResponse>(ENDPOINTS.shops.detail(shopId));

// 가게 수정
export const updateShop = (shopId: string, body: ShopUpdatePayload) =>
  http.put<ShopResponse>(ENDPOINTS.shops.detail(shopId), body);
