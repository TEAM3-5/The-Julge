import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';

export const listNotices = (shopId: string) => http.get(ENDPOINTS.notices.listByShop(shopId));

export const getNotice = (shopId: string, noticeId: string) =>
  http.get(ENDPOINTS.notices.detail(shopId, noticeId));

export const createNotice = (shopId: string, body: unknown) =>
  http.post(ENDPOINTS.notices.listByShop(shopId), body);

export const updateNotice = (shopId: string, noticeId: string, body: unknown) =>
  http.put(ENDPOINTS.notices.detail(shopId, noticeId), body);
