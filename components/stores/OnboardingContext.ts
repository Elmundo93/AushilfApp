import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserInfo {
  vorname: string;
  nachname: string;
  telefonnummer: string;
  email: string;
  plz: string;
  wohnort: string;
  straße: string;
  hausnummer: string;
  steuernummer?: string;
  kategorien?: string[];
  bio?: string;
  profileImageUrl?: string;
  password?: string;
  step?: number;
}

interface OnboardingState {
  userInfo: UserInfo;
  categories: string[];
  bio: string;
  profileImage: string | null;
  password: string;
  step: number;
  setUserInfo: (field: keyof UserInfo, value: string) => void;
  setField: <K extends keyof Omit<
    OnboardingState,
    'setUserInfo' | 'setField' | 'validate' | 'persist' | 'restore' | 'reset' | 'getFullCityField'
  >>(field: K, value: OnboardingState[K]) => void;
  validate: () => boolean;
  persist: () => Promise<void>;
  restore: () => Promise<void>;
  reset: () => void;
  getFullCityField: () => string;
}

const STORAGE_KEY = 'onboardingData';

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  userInfo: {
    vorname: '',
    nachname: '',
    telefonnummer: '',
    email: '',
    plz: '',
    wohnort: '',
    straße: '',
    hausnummer: '',
    steuernummer: '',
  },
  categories: [],
  bio: '',
  profileImage: null,
  password: '',
  step: 0,

  setUserInfo: (field, value) =>
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        [field]: value,
      },
    })),

  setField: (field, value) => set(() => ({ [field]: value })),

  validate: () => {
    const { userInfo } = get();
    const requiredFields: (keyof UserInfo)[] = [
      'vorname',
      'nachname',
      'telefonnummer',
      'email',
      'plz',
      'wohnort',
      'straße',
      'hausnummer',
    ];
    return requiredFields.every(
      (field) => userInfo[field] && userInfo[field].toString().trim().length > 0
    );
  },

  persist: async () => {
    const state = get();
    const dataToStore = JSON.stringify({
      userInfo: state.userInfo,
      categories: state.categories,
      bio: state.bio,
      profileImage: state.profileImage,
      password: state.password,
      step: state.step,
    });
    await AsyncStorage.setItem(STORAGE_KEY, dataToStore);
  },

  restore: async () => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const data = JSON.parse(json);
      set(() => ({
        userInfo: data.userInfo ?? {
          vorname: '',
          nachname: '',
          phone: '',
          email: '',
          zip: '',
          city: '',
          street: '',
          taxId: '',
        },
        categories: data.categories ?? [],
        bio: data.bio ?? '',
        profileImage: data.profileImage ?? null,
        password: data.password ?? '',
        step: data.step ?? 0,
      }));
    }
  },

  reset: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set(() => ({
      userInfo: {
        vorname: '',
        nachname: '',
        telefonnummer: '',
        email: '',
        plz: '',
        wohnort: '',
        straße: '',
        hausnummer: '',
        steuernummer: '',
      },
      categories: [],
      bio: '',
      profileImage: null,
      password: '',
      step: 0,
    }));
  },

  getFullCityField: () => {
    const { plz, wohnort } = get().userInfo;
    return `${wohnort} ${plz}`.trim();
  },
}));