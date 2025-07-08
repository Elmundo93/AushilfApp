// components/hooks/useFilteredChannels.ts
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { StoredChannel } from '@/components/types/stream';

export const useFilteredChannelsStreamChatStore = (selectedCategory: string | null): StoredChannel[] => {
  const channels = useStreamChatStore((s) => s.channels);

  const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
  const isValidCategory = (category: string) => validCategories.includes(category);

  // Debug: Log channel categories
  // console.log('🔍 Debugging channels in useFilteredChannels:');
  // channels.forEach((channel, index) => {
  //   const effectiveCategory = (channel.custom_post_category_choosen && isValidCategory(channel.custom_post_category_choosen)) 
  //     ? channel.custom_post_category_choosen 
  //     : channel.custom_post_category;
  //   console.log(`Channel ${index}:`, {
  //     cid: channel.cid,
  //     custom_post_category: channel.custom_post_category,
  //     custom_post_category_choosen: channel.custom_post_category_choosen,
  //     effectiveCategory: effectiveCategory
  //   });
  // });

  if (!selectedCategory) return channels;

  return channels.filter(
    (channel: StoredChannel) => {
      const effectiveCategory = (channel.custom_post_category_choosen && isValidCategory(channel.custom_post_category_choosen)) 
        ? channel.custom_post_category_choosen 
        : channel.custom_post_category;
      return effectiveCategory === selectedCategory;
    }
  );
};