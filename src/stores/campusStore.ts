// src/stores/campusStore.ts

import { create } from 'zustand';

type UIState = {
  showCampus: boolean;
  openCampus: () => void;
  closeCampus: () => void;
};

export const useUIStore = create<UIState>(set => ({
  showCampus: false,
  openCampus: () => set({ showCampus: true }),
  closeCampus: () => set({ showCampus: false }),
}));