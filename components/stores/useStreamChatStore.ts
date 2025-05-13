// components/stores/useStreamChatStore.ts
import { create } from 'zustand';
import { StoredChannel } from '@/components/types/stream';

type StreamChatOverviewState = {
  channels: StoredChannel[];
  loading: boolean;
  channelsReady: boolean;
  setChannels: (channels: StoredChannel[]) => void;
  setLoading: (val: boolean) => void;
  setChannelsReady: (val: boolean) => void;
};

export const useStreamChatStore = create<StreamChatOverviewState>((set) => ({
  channels: [],
  loading: false,
  channelsReady: false,
  setChannels: (channels) => set({ channels }),
  setLoading: (val) => set({ loading: val }),
  setChannelsReady: (val) => set({ channelsReady: val }),
}));