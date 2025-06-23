// nachrichten/index.tsx
import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { CategoryFilter } from '@/components/Nachrichten/CategoryFilter';
import ChannelPreview from '@/components/Nachrichten/Channel/ChannelPreview';
import { useFilteredChannelsStreamChatStore } from '@/components/hooks/useFilteredChannels';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { StoredChannel } from '@/components/types/stream';
import { useChatContext } from '@/components/provider/ChatProvider';
import LottieView from 'lottie-react-native';
import { useChatListeners } from '@/components/services/Storage/Hooks/useChatListener';
import { useChatLifecycle } from '@/components/services/Storage/Hooks/useChatLifecycle';
import { useSQLiteContext } from 'expo-sqlite';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';

function ChannelList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { fontSize } = useContext(FontSizeContext);
  const db = useSQLiteContext();
  const { streamChatClient, user } = useAuthStore();
  const { setMessages: setActiveMessages, messages: activeMessages } = useActiveChatStore();
  const setZustandChannels = useStreamChatStore((s) => s.setChannels);

  const chatContext = useChatContext();
  const syncChannels = chatContext.syncChannels;

  const channels = useFilteredChannelsStreamChatStore(selectedCategory);
  const loading = useStreamChatStore((s) => s.loading);

  const minIconSize = 75;
  const maxIconSize = 280;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleChannelSelect = (channel: StoredChannel) => {
    router.push({
      pathname: '/nachrichten/channel/[cid]',
      params: { cid: channel.cid },
    });
  };
  useEffect(() => {
    syncChannels();
  }, []);

  useChatListeners(streamChatClient, null, setActiveMessages, setZustandChannels, db, user, activeMessages);
  useChatLifecycle(user?.id, db);

  return (
    <View style={styles.container}>
      {loading ? (
        <LottieView source={require('@/assets/animations/LoadingWarp.json')} autoPlay loop />
      ) : (
        <>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            iconSize={iconSize}
          />
          <FlatList
            data={channels}
            keyExtractor={(item) => item.cid}
            renderItem={({ item }) => (
              <ChannelPreview
                channel={item as any}
                onSelect={handleChannelSelect}
              />
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ChannelList;