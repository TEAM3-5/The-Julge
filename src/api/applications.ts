import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';

export const listApplicationsByNotice = (shopId: string, noticeId: string) =>
  http.get(ENDPOINTS.applications.listByNotice(shopId, noticeId));

export const createApplication = (shopId: string, noticeId: string, body: unknown) =>
  http.post(ENDPOINTS.applications.listByNotice(shopId, noticeId), body);

export const cancelApplication = (
  shopId: string,
  noticeId: string,
  applicationId: string,
  body: unknown,
) => http.put(ENDPOINTS.applications.detail(shopId, noticeId, applicationId), body);

export const listApplicationsByUser = (userId: string) =>
  http.get(ENDPOINTS.applications.listByUser(userId));
