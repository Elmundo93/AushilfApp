import { create } from 'zustand';

export interface Location {
  latitude: number;
  longitude: number;
}

interface LocationStore {
  locationPermission: boolean;
  setLocationPermission: (locationPermission: boolean) => void;
  location: Location | null;
  setLocation: (location: Location) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  locationPermission: false,
  setLocationPermission: (locationPermission: boolean) => set({ locationPermission }),
  location: null,
  setLocation: (location: Location) => set({ location }),
}));