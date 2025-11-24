import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';

export const createImagePresignedUrl = (body: unknown) =>
  http.post(ENDPOINTS.images.createPresignedUrl, body);
