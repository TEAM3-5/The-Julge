"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { ConfirmModal, ConfirmModalProps } from "./ConfirmModal";
import { ActionModal, ActionModalProps } from "./ActionModal";
import { ModalBase } from "./ModalBase";

type ConfirmPayload = Omit<ConfirmModalProps, "isOpen" | "onClose">;
type ActionPayload = Omit<ActionModalProps, "isOpen" | "onClose">;
type CustomPayload = { render: (close: () => void) => ReactNode };

// 항상 모달 하나만 띄우는 구조
type ModalState =
  | { type: "confirm"; props: ConfirmPayload }
  | { type: "action"; props: ActionPayload }
  | { type: "custom"; props: CustomPayload }
  | { type: null; props: null };

type ModalContextValue = {
  openConfirm: (props?: ConfirmPayload) => void;
  openAction: (props: ActionPayload) => void;
  openCustom: (render: CustomPayload["render"]) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({
    type: null,
    props: null,
  });

  const close = useCallback(() => {
    setState({ type: null, props: null });
  }, []);

  const openConfirm = useCallback((props?: ConfirmPayload) => {
    setState({ type: "confirm", props: props ?? {} });
  }, []);

  const openAction = useCallback((props: ActionPayload) => {
    setState({ type: "action", props });
  }, []);

  const openCustom = useCallback((render: CustomPayload["render"]) => {
    setState({ type: "custom", props: { render } });
  }, []);

  return (
    <ModalContext.Provider
      value={{ openConfirm, openAction, openCustom, close }}
    >
      {children}
      <ModalRoot state={state} onRequestClose={close} />
    </ModalContext.Provider>
  );
}

function ModalRoot({
  state,
  onRequestClose,
}: {
  state: ModalState;
  onRequestClose: () => void;
}) {
  if (!state.type || !state.props) return null;

  if (state.type === "confirm") {
    return (
      <ConfirmModal
        isOpen={true}
        onClose={onRequestClose}
        {...state.props}
      />
    );
  }

  if (state.type === "action") {
    return (
      <ActionModal
        isOpen={true}
        onClose={onRequestClose}
        {...state.props}
      />
    );
  }

  if (state.type === "custom") {
    return (
      <ModalBase isOpen={true} onClose={onRequestClose}>
        {state.props.render(onRequestClose)}
      </ModalBase>
    );
  }

  return null;
}

export function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal은 반드시 <ModalProvider> 내부에서 사용해야 합니다.");
  }
  return ctx;
}
