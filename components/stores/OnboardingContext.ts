import { create } from 'zustand';

interface OnboardingState {
  fullName: string;
  phone: string;
  city: string;
  taxId: string;
  helpType: string;
  categories: string[];
  bio: string;
  profileImage: string | null;
  email: string;
  street: string;
  password: string;
  setField: (field: string, value: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  fullName: '',
  phone: '',
  city: '',
  taxId: '',
  helpType: '', // 'suche' | 'biete'
  categories: [],
  bio: '',
  profileImage: null,
  email: '',
  street: '',
  password: '',
  setField: (field: string, value: string) => set({ [field]: value }),
}));