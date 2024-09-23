import { create } from 'zustand';

interface DanksagungStore {
  danksagungCount: number;
  incrementDanksagungCount: () => void;
}

export const useDanksagungStore = create<DanksagungStore>((set) => ({
  danksagungCount: 0,
  incrementDanksagungCount: () => set((state) => ({ danksagungCount: state.danksagungCount + 1 })),
}));