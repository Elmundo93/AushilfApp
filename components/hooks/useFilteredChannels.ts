// components/hooks/useFilteredChannels.ts
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { StoredChannel } from '@/components/types/stream';

export const useFilteredChannelsStreamChatStore = (selectedCategory: string | null): StoredChannel[] => {
  const channels = useStreamChatStore((s) => s.channels);

  if (!selectedCategory) return channels;

  return channels.filter(
    (channel) => channel.custom_post_category === selectedCategory
  );
};