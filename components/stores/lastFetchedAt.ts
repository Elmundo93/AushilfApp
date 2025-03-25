import { create } from 'zustand';

export const useLastFetchedAtStore = create<{
  refreshCount: number;
  setRefreshCount: (refreshCount: number) => void;
  lastFetchedAt: number | null;
  setLastFetchedAt: (lastFetchedAt: number) => void;
  lastFetchedAtDragHandler: number | null;
  setLastFetchedAtDragHandler: (lastFetchedAtDragHandler: number) => void;
}>((set) => ({
  refreshCount: 0,
  setRefreshCount: (refreshCount) => set({ refreshCount }),
  lastFetchedAt: null,
  setLastFetchedAt: (lastFetchedAt) => set({ lastFetchedAt }),
  lastFetchedAtDragHandler: null,
  setLastFetchedAtDragHandler: (lastFetchedAtDragHandler) => set({ lastFetchedAtDragHandler }),
}));


