import { ENDPOINTS } from '@/constants/api';
import { http } from '@/lib/api';

export const listAlerts = (userId: string) => http.get(ENDPOINTS.alerts.list(userId));

export const deleteAlert = (userId: string, alertId: string) =>
  http.put(ENDPOINTS.alerts.delete(userId, alertId));
