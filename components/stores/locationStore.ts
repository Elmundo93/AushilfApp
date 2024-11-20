import { create } from 'zustand';

export interface Location {
  latitude: number;
  longitude: number;
}

interface LocationStore {
  location: Location | null;
  setLocation: (location: Location) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  location: null,
  setLocation: (location: Location) => set({ location }),
}));