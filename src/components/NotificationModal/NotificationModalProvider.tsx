'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { NotificationModal } from './NotificationModal';

type NotificationModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

// 컨텍스트 생성
export const NotificationModalContext = createContext<
  NotificationModalContextValue | undefined
>(undefined);

type Props = {
  children: ReactNode;
};

// 전역 Provider: children + 모달 UI를 같이 렌더링
export function NotificationModalProvider({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <NotificationModalContext.Provider value={{ isOpen, open, close }}>
      {children}

      {/* 전역 알림 모달 (항상 트리에 존재, isOpen으로만 제어) */}
      <NotificationModal isOpen={isOpen} onClose={close} />
    </NotificationModalContext.Provider>
  );
}

export function useNotificationModalContext() {
  const ctx = useContext(NotificationModalContext);
  if (!ctx) throw new Error('NotificationModalProvider 안에서만 사용할 수 있습니다.');
  return ctx;
}
