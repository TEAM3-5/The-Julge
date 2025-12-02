'use client';

import { useContext } from 'react';
import {
  NotificationModalContext,
} from '@/components/NotificationModal/NotificationModalProvider';

export function useNotificationModal() {
  const ctx = useContext(NotificationModalContext);
  if (!ctx) throw new Error('useNotificationModal은 NotificationModalProvider 내부에서만 사용해야 합니다.');
  return ctx;
}
