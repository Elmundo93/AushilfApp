// components/hooks/useFilteredChannels.ts
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { useMuteStore } from '@/components/stores/useMuteStore';
import { StoredChannel } from '@/components/types/stream';

export const useFilteredChannelsStreamChatStore = (selectedCategory: string | null): StoredChannel[] => {
  const channels = useStreamChatStore((s) => s.channels);
  const { isChannelMuted, isUserMuted } = useMuteStore();

  const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
  const isValidCategory = (category: string) => validCategories.includes(category);

  // Filter out muted channels and channels with muted users
  const filteredChannels = channels.filter((channel: StoredChannel) => {
    // Check if channel is muted
    const isChannelMutedState = isChannelMuted(channel.cid);
    
    // Check if the partner user is muted
    const isPartnerMuted = channel.partner_user_id ? isUserMuted(channel.partner_user_id) : false;
    
    // Return false if either channel is muted or partner user is muted (to filter them out completely)
    return !isChannelMutedState && !isPartnerMuted;
  });

  if (!selectedCategory) return filteredChannels;

  return filteredChannels.filter(
    (channel: StoredChannel) => {
      const effectiveCategory = (channel.custom_post_category_choosen && isValidCategory(channel.custom_post_category_choosen)) 
        ? channel.custom_post_category_choosen 
        : channel.custom_post_category;
      return effectiveCategory === selectedCategory;
    }
  );
};

// Hook to get muted channels for a separate "Muted" section
export const useMutedChannels = (): StoredChannel[] => {
  const channels = useStreamChatStore((s) => s.channels);
  const { isChannelMuted, isUserMuted } = useMuteStore();

  return channels.filter((channel: StoredChannel) => {
    const isChannelMutedState = isChannelMuted(channel.cid);
    const isPartnerMuted = channel.partner_user_id ? isUserMuted(channel.partner_user_id) : false;
    
    // Return true if either channel is muted or partner user is muted
    return isChannelMutedState || isPartnerMuted;
  });
};

// Hook to get muted users for display in a separate section
export const useMutedUsers = () => {
  const { mutedUsers } = useMuteStore();
  return mutedUsers;
};