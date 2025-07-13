// nachrichten/index.tsx
import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { CategoryFilter } from '@/components/Nachrichten/CategoryFilter';
import ChannelPreview from '@/components/Nachrichten/Channel/ChannelPreview';
import MutedUsersList from '@/components/Nachrichten/MutedUsersList';
import { useFilteredChannelsStreamChatStore, useMutedChannels, useMutedUsers } from '@/components/hooks/useFilteredChannels';
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
import { useSafeLoading } from '@/components/hooks/useLoading';
import { useMuteStore } from '@/components/stores/useMuteStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function ChannelList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMuted, setShowMuted] = useState(false);
  const [showMutedUsers, setShowMutedUsers] = useState(false);
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
  const mutedChannels = useMutedChannels();
  const mutedUsers = useMutedUsers();
  const rawLoading = useStreamChatStore((s) => s.loading);
  const channelsReady = useStreamChatStore((s) => s.channelsReady);

  // Use safe loading to prevent conflicts with global loading
  const loading = useSafeLoading(rawLoading);

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

  const NavigateToCreatePost = () => {
    router.push('/pinnwand');

    setTimeout(() => {
      router.push('/createPost');
    }, 500);
  };

  useChatListeners(streamChatClient, null, addMessage, setZustandChannels, db, user, activeMessages);
  useChatLifecycle(user?.id, db);

  // Debug: Log channel state
  useEffect(() => {
    // Removed excessive logging to prevent loops
  }, [channels.length, loading, isInitialized, channelsReady, selectedCategory]);

  const renderMutedSection = () => {
    if (mutedChannels.length === 0) return null;

    return (
      <View style={styles.mutedSection}>
        <TouchableOpacity 
          style={styles.mutedHeader}
          onPress={() => setShowMuted(!showMuted)}
        >
          <MaterialCommunityIcons 
            name={showMuted ? "chevron-down" : "chevron-right"} 
            size={20} 
            color="#666" 
          />
          <Text style={styles.mutedHeaderText}>
            Stummgeschaltete Channels ({mutedChannels.length})
          </Text>
        </TouchableOpacity>
        
        {showMuted && (
          <View style={styles.mutedChannels}>
            {mutedChannels.map((channel) => (
              <ChannelPreview
                key={channel.cid}
                channel={channel}
                onSelect={handleChannelSelect}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderMutedUsersSection = () => {
    if (mutedUsers.length === 0) return null;

    return (
      <View style={styles.mutedSection}>
        <TouchableOpacity 
          style={styles.mutedHeader}
          onPress={() => setShowMutedUsers(!showMutedUsers)}
        >
          <MaterialCommunityIcons 
            name={showMutedUsers ? "chevron-down" : "chevron-right"} 
            size={20} 
            color="#666" 
          />
          <Text style={styles.mutedHeaderText}>
            Stummgeschaltete Benutzer ({mutedUsers.length})
          </Text>
        </TouchableOpacity>
        
        {showMutedUsers && (
          <MutedUsersList />
        )}
      </View>
    );
  };

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
      ) : (
        <>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            iconSize={iconSize}
          />
          {renderMutedUsersSection()}
          {renderMutedSection()}
          
          {channels.length === 0 && !loading ? (
            <View style={styles.emptyContainer}>
              <View style={styles.navigationContainer}>
                <Text style={styles.emptyText}>Keine Nachrichten vorhanden</Text>
                <Text style={styles.emptySubText}>Versuch's mal mit einem Post um zu schauen ob es jemanden gibt der dir hilft oder deine Hilfe benötigt!</Text>
                <TouchableOpacity style={styles.navigationButton} onPress={NavigateToCreatePost}>
                  <Text style={styles.navigationButtonText}>Erstelle einen Post</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.emptySubText}>
                {selectedCategory 
                  ? `Keine Chats in der Kategorie "${selectedCategory}" gefunden. Wählen Sie eine andere Kategorie oder alle Kategorien.`
                  : ''
                }
              </Text>
              {selectedCategory && (
                <TouchableOpacity 
                  style={styles.resetFilterButton}
                  onPress={() => setSelectedCategory(null)}
                >
                  <View style={styles.resetFilterGradient}>
                    <Text style={styles.resetFilterText}>Alle Kategorien anzeigen</Text>
                    <Text style={styles.resetFilterSubText}>Filter zurücksetzen</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ) : (
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
          )}
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
  navigationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  navigationButton: { 
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'orange',
  },
  navigationButtonText: {
    color: 'orange',
    fontSize: 22,
    letterSpacing: 0.5,
    textAlign: 'center',
    padding: 10,
    fontWeight: '700',
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#666',
  },
  mutedSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mutedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
  },
  mutedHeaderText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  mutedChannels: {
    backgroundColor: '#f8f8f8',
  },
  resetFilterButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'orange',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
    alignSelf: 'center',
  },
  resetFilterGradient: {
    backgroundColor: 'orange',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetFilterText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetFilterSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default ChannelList;