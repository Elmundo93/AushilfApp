import { create } from 'zustand';
import { Danksagung } from '../types/Danksagungen';

interface DanksagungStore {
  danksagungCount: number;
  danksagungen: Danksagung[];
  setDanksagungen: (danksagungen: Danksagung[]) => void;
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;   
  incrementDanksagungCount: () => void;
}

export const useDanksagungStore = create<DanksagungStore>((set) => ({
  danksagungCount: 0,
  danksagungen: [],
  loading: false,
  error: null,
  setDanksagungen: (danksagungen: Danksagung[]) => set({ danksagungen }),
  setLoading: (loading: boolean) => set({ loading }),
  incrementDanksagungCount: () => set((state) => ({ danksagungCount: state.danksagungCount + 1 })),
}));