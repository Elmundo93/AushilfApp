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
  // Additional utility methods for respectful store management
  addChannel: (channel: StoredChannel) => void;
  removeChannel: (cid: string) => void;
  updateChannel: (cid: string, updates: Partial<StoredChannel>) => void;
  clearChannels: () => void;
  getChannel: (cid: string) => StoredChannel | undefined;
};

export const useStreamChatStore = create<StreamChatOverviewState>((set, get) => ({
  channels: [],
  loading: false,
  channelsReady: false,

  setChannels: (channels) => {
    console.log('🔄 Setting channels in store:', channels.length);
    set({ channels });
  },

  setLoading: (val) => set({ loading: val }),
  setChannelsReady: (val) => set({ channelsReady: val }),
  
  // Utility methods for respectful store management
  addChannel: (channel) => {
    const { channels } = get();
    const exists = channels.some(ch => ch.cid === channel.cid);
    if (!exists) {
      console.log('➕ Adding channel to store:', channel.cid);
      set({ channels: [channel, ...channels] });
    } else {
      console.log('ℹ️ Channel already exists in store:', channel.cid);
    }
  },
  
  removeChannel: (cid) => {
    const { channels } = get();
    const updatedChannels = channels.filter(ch => ch.cid !== cid);
    console.log(`🗑️ Removing channel from store: ${cid}. Remaining: ${updatedChannels.length}`);
    set({ channels: updatedChannels });
  },
  
  updateChannel: (cid, updates) => {
    const { channels } = get();
    const updatedChannels = channels.map(ch => 
      ch.cid === cid ? { ...ch, ...updates } : ch
    );
    console.log(`🔄 Updating channel in store: ${cid}`);
    set({ channels: updatedChannels });
  },
  
  clearChannels: () => {
    console.log('🧹 Clearing all channels from store');
    set({ channels: [], channelsReady: false });
  },
  
  getChannel: (cid) => {
    const { channels } = get();
    return channels.find(ch => ch.cid === cid);
  },
}));