import { create } from 'zustand';
import { UserProfile } from '../types/auth';

interface PartnerStore {
  partner: UserProfile | null;
  setPartner: (partner: UserProfile) => void;
}


export const usePartnerStore = create<PartnerStore>((set) => ({
  partner: null,
  setPartner: (partner: UserProfile) => set({ partner }),
}));


