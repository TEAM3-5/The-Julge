export const TEAM_ID: `${number}-${number}` = '19-5';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? `https://bootcamp-api.codeit.kr/api/${TEAM_ID}/the-julge`;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

export const ENDPOINTS = {
  images: {
    createPresignedUrl: '/images',
  },
  auth: {
    login: '/token',
  },
  shops: {
    list: '/shops',
    detail: (shopId: string) => `/shops/${shopId}`,
  },
  notices: {
    list: '/notices',
    listByShop: (shopId: string) => `/shops/${shopId}/notices`,
    detail: (shopId: string, noticeId: string) => `/shops/${shopId}/notices/${noticeId}`,
  },
  applications: {
    listByNotice: (shopId: string, noticeId: string) =>
      `/shops/${shopId}/notices/${noticeId}/applications`,
    detail: (shopId: string, noticeId: string, applicationId: string) =>
      `/shops/${shopId}/notices/${noticeId}/applications/${applicationId}`,
    listByUser: (userId: string) => `/users/${userId}/applications`,
  },
  users: {
    create: '/users',
    detail: (userId: string) => `/users/${userId}`,
  },
  alerts: {
    list: (userId: string) => `/users/${userId}/alerts`,
    delete: (userId: string, alertId: string) => `/users/${userId}/alerts/${alertId}`,
  },
} as const;
