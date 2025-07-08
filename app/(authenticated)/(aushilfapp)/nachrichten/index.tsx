// nachrichten/index.tsx
import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
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
import { useOptimizedChatLoading } from '@/components/Chat/hooks/useOptimizedChatLoading';

function ChannelList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { fontSize } = useContext(FontSizeContext);
  const db = useSQLiteContext();
  const { streamChatClient, user } = useAuthStore();
  const { addMessage, messages: activeMessages } = useActiveChatStore();
  const setZustandChannels = useStreamChatStore((s) => s.setChannels);

  const chatContext = useChatContext();
  const syncChannels = chatContext.syncChannels;

  // Optimierte Chat-Loading Hook - gibt nur isInitialized zurück
  const { isInitialized } = useOptimizedChatLoading();

  const channels = useFilteredChannelsStreamChatStore(selectedCategory);
  const loading = useStreamChatStore((s) => s.loading);
  const channelsReady = useStreamChatStore((s) => s.channelsReady);

  const minIconSize = 75;
  const maxIconSize = 280;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleChannelSelect = (channel: StoredChannel) => {
    console.log('🔍 Channel selected:', channel.cid);
    router.push({
      pathname: '/nachrichten/channel/[cid]',
      params: { cid: channel.cid },
    });
  };

  useEffect(() => {
    // Entfernt: Automatischer Sync beim Laden der ChannelList
    // Das verursacht das Problem, da es den Store zurücksetzt
    // Der Sync sollte nur bei Bedarf erfolgen, nicht automatisch
  }, [user?.id]);

  useChatListeners(streamChatClient, null, addMessage, setZustandChannels, db, user, activeMessages);
  useChatLifecycle(user?.id, db);

  // Debug: Log channel state
  useEffect(() => {
    // Removed excessive logging to prevent loops
  }, [channels.length, loading, isInitialized, channelsReady, selectedCategory]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieView 
            source={require('@/assets/animations/LoadingWarp.json')} 
            autoPlay 
            loop 
            style={styles.loadingAnimation}
          />
          <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        </View>
      ) : channels.length === 0 && channelsReady ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Keine Nachrichten vorhanden</Text>
          <Text style={styles.emptySubText}>Suchen Sie nach Posts und starten Sie eine Konversation!</Text>
        </View>
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
            contentContainerStyle={styles.channelList}
            showsVerticalScrollIndicator={false}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  spinner: {
    marginTop: 20,
  },
  channelList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default ChannelList;