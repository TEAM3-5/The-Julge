import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';

// status값 정의
export type ApplicationStatusUpdate = "accepted" | "rejected" | "canceled";

export const listApplicationsByNotice = (shopId: string, noticeId: string) =>
  http.get(ENDPOINTS.applications.listByNotice(shopId, noticeId));

export const createApplication = (shopId: string, noticeId: string, body: unknown) =>
  http.post(ENDPOINTS.applications.listByNotice(shopId, noticeId), body);


export const updateApplicationStatus = (
  shopId: string,
  noticeId: string,
  applicationId: string,
  status: ApplicationStatusUpdate,
) => {
  return http.put(
    ENDPOINTS.applications.detail(shopId, noticeId, applicationId),
    { status },
  );
};

export const cancelApplication = (
  shopId: string,
  noticeId: string,
  applicationId: string,
) => updateApplicationStatus(shopId, noticeId, applicationId, "canceled");

export const listApplicationsByUser = (userId: string) =>
  http.get(ENDPOINTS.applications.listByUser(userId));