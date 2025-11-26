import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';
import type { NoticeListResponse } from '@/types/notice';

export type NoticesQuery = {
  offset?: number;
  limit?: number;
  address?: string;
  keyword?: string;
  startsAtGte?: string;
  hourlyPayGte?: number;
  sort?: 'time' | 'pay' | 'hour' | 'shop';
};

// 전체 공고 조회
export const listNoticesAll = (params?: NoticesQuery) =>
  http.get<NoticeListResponse>(ENDPOINTS.notices.list, { params });

// 특정 가게 공고 조회
export const listNoticesByShop = (shopId: string) => http.get(ENDPOINTS.notices.listByShop(shopId));

export const getNotice = (shopId: string, noticeId: string) =>
  http.get(ENDPOINTS.notices.detail(shopId, noticeId));

export const createNotice = (shopId: string, body: unknown) =>
  http.post(ENDPOINTS.notices.listByShop(shopId), body);

export const updateNotice = (shopId: string, noticeId: string, body: unknown) =>
  http.put(ENDPOINTS.notices.detail(shopId, noticeId), body);
