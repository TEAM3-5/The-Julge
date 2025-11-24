import { create } from 'zustand';

type UIState = {
  modalId: string | null;
  setModal: (id: string | null) => void;
  toastMessage: string | null;
  setToast: (message: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  modalId: null,
  setModal: (id) => set({ modalId: id }),
  toastMessage: null,
  setToast: (message) => set({ toastMessage: message }),
}));
