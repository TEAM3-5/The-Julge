import axios from 'axios';
import { API_BASE_URL, DEFAULT_HEADERS } from '@/constants/api';

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
});

export const setAuthToken = (token: string | null | undefined) => {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
};

// 공통 401 처리: 토큰 해제 후 메인 페이지로 이동
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  },
);
