import { create } from 'zustand';
import { Danksagung } from '../types/Danksagungen';

interface DanksagungStore {
  danksagungCount: number;
  danksagungen: Danksagung[];
  setDanksagungen: (danksagungen: Danksagung[]) => void;
  addDanksagung: (danksagung: Danksagung) => void;
  addDanksagungen: (danksagungen: Danksagung[]) => void;
  removeDanksagung: (id: string) => void;
  updateDanksagung: (id: string, updates: Partial<Danksagung>) => void;
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  incrementDanksagungCount: () => void;
  clearDanksagungen: () => void;
}

export const useDanksagungStore = create<DanksagungStore>((set, get) => ({
  danksagungCount: 0,
  danksagungen: [],
  loading: false,
  error: null,
  
  setDanksagungen: (danksagungen: Danksagung[]) => set({ danksagungen }),
  
  addDanksagung: (danksagung: Danksagung) => set((state) => ({
    danksagungen: [danksagung, ...state.danksagungen],
    danksagungCount: state.danksagungCount + 1,
  })),
    
  addDanksagungen: (newDanksagungen: Danksagung[]) =>
    set((state) => {
      // Filter out existing danksagungen and add new ones
      const existingIds = new Set(state.danksagungen.map(d => d.id));
      const uniqueNewDanksagungen = newDanksagungen.filter(d => !existingIds.has(d.id));
      
      if (uniqueNewDanksagungen.length === 0) {
        return state;
      }
      
      const combined = [...uniqueNewDanksagungen, ...state.danksagungen];
      return { danksagungen: combined };
    }),
    
  removeDanksagung: (id: string) =>
    set((state) => ({
      danksagungen: state.danksagungen.filter(d => d.id !== id)
    })),
    
  updateDanksagung: (id: string, updates: Partial<Danksagung>) =>
    set((state) => ({
      danksagungen: state.danksagungen.map(d =>
        d.id === id ? { ...d, ...updates } : d
      )
    })),
    
  setLoading: (loading: boolean) => set({ loading }),
  
  setError: (error: string | null) => set({ error }),
  
  incrementDanksagungCount: () => set((state) => ({ danksagungCount: state.danksagungCount + 1 })),
  
  clearDanksagungen: () => set({ danksagungen: [] }),
}));