"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Toast, ToastVariant } from "./toast";

/**
 * ToastContext에 저장될 값 타입
 */
type ToastContextValue = {
  // 토스트를 띄우는 함수
  showToast: (
    message: ReactNode,
    options?: {
      variant?: ToastVariant; // "error" | "success" | "info", 기본값 "info"
      duration?: number;      // 자동으로 닫힐 때 까지의 시간(ms), 기본값 2000ms
    }
  ) => void;
};

/**
 * 실제 Context 객체
 * - 초기값은 null → useToast에서 null 체크
 */
const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Provider 컴포넌트 Props
 */
type ToastProviderProps = {
  children: ReactNode;
};

/**
 * ToastProvider
 * - 전역 토스트 상태를 관리하는 컴포넌트
 * - layout.tsx에서 앱 전체를 <ToastProvider>로 감싸서 사용
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [isOpen, setIsOpen] = useState(false);                  // 토스트 열림 상태
  const [message, setMessage] = useState<ReactNode>("");        // 토스트에 표시할 메시지
  const [variant, setVariant] = useState<ToastVariant>("info"); // 토스트 스타일 종류
  const closeTimerRef = useRef<number | null>(null);            // 현재 열려 있는 토스트를 닫기 위한 타이머 ID 

  /**
   * showToast
   * 
   * - 어디서든 호출해서 토스트를 띄우는 함수
   * - 여러 번 연속으로 호출될 때 이전 타이머는 정리해서
   *   "가장 마지막으로 호출된 토스트" 기준으로 duration을 적용
   * 사용 예:
   *   showToast("거절 했어요.", { variant: "error", duration: 2000 });
   */
  const showToast: ToastContextValue["showToast"] = useCallback(
    (msg, options) => {
      // 메시지/스타일 업데이트
      setMessage(msg);                        // 토스트 메시지 설정
      setVariant(options?.variant ?? "info"); // 스타일 기본값 "info"
      setIsOpen(true);                        // 토스트 열기

      // 닫기 타이머 설정(duration 기본값 2000ms)
      const duration = options?.duration ?? 2000;

      // 이전에 설정된 타이머가 있으면 제거 (중복 close 방지)
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }

      // 새 타이머 설정
      const timerId = window.setTimeout(() => {
        setIsOpen(false);
        closeTimerRef.current = null;
      }, duration);

      closeTimerRef.current = timerId;
    },
    []
  );

  // Provider 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Context에 내려줄 값 메모이제이션
  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {/* 실제 페이지 내용 */}
      {children}

      {/* 항상 트리 최하단에 붙어 있는 전역 토스트 */}
      <Toast isOpen={isOpen} message={message} variant={variant} />
    </ToastContext.Provider>
  );
}

/**
 * useToast
 *
 * - 컴포넌트에서 토스트를 사용하기 위한 커스텀 훅
 * - 반드시 <ToastProvider>로 감싸진 영역 내부에서만 사용해야 함
 */
export function useToast() {
  const ctx = useContext(ToastContext);

  // Provider 바깥에서 사용하면 바로 에러를 표시해서 개발 단계에서 잡을 수 있도록 함
  if (!ctx) {
    throw new Error("useToast는 ToastProvider 안에서만 사용할 수 있습니다.");
  }

  return ctx;
}
