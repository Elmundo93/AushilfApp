import { create } from 'zustand';
import { StoredChannel } from '@/components/types/stream';
import { useAuthStore } from './AuthStore';

type StreamChatOverviewState = {
  channels: StoredChannel[];
  loading: boolean;
  channelsReady: boolean;
  setChannels: (channels: StoredChannel[]) => void;
  setLoading: (val: boolean) => void;
  setChannelsReady: (val: boolean) => void;
};

export const useStreamChatStore = create<StreamChatOverviewState>((set, get) => ({
  channels: [],
  loading: false,
  channelsReady: false,

  setChannels: (channels) => {
    set({ channels });
  },

  setLoading: (val) => set({ loading: val }),
  setChannelsReady: (val) => set({ channelsReady: val }),
}));