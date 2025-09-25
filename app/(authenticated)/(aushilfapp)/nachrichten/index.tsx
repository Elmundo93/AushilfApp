// app/(authenticated)/(aushilfapp)/nachrichten/index.tsx
import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { CategoryFilter } from '@/components/Nachrichten/CategoryFilter';
import ChannelPreview from '@/components/Nachrichten/Channel/ChannelPreview';
import EmptyList from '@/components/Nachrichten/Costum/EmptyList';
import { useSQLiteContext } from 'expo-sqlite';
import { useLiveQuery } from '@/components/hooks/useLiveQuery';
import { TOPIC } from '@/components/lib/liveBus';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useChat } from '@/components/provider/ChatProvider';

export default function ChannelList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { fontSize } = useContext(FontSizeContext);
  const db = useSQLiteContext();
  const { user } = useAuthStore();
  const currentUserId = user?.id ?? '';

  const { unreadByChannel = {}, ready } = useChat() ?? { unreadByChannel: {}, ready: false };

  const minIconSize = 75;
  const maxIconSize = 280;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  // SQL: nur Channels, bei denen der aktuelle User Mitglied ist
  const sql = selectedCategory
    ? `SELECT c.*
         FROM channels_local c
         JOIN channel_members_local m ON m.channel_id = c.id
        WHERE m.user_id = ?
          AND m.role IS NOT NULL
          AND lower(c.custom_category)=lower(?)
        ORDER BY COALESCE(c.last_message_at, c.updated_at) DESC`
    : `SELECT c.*
         FROM channels_local c
         JOIN channel_members_local m ON m.channel_id = c.id
        WHERE m.user_id = ?
          AND m.role IS NOT NULL
        ORDER BY COALESCE(c.last_message_at, c.updated_at) DESC`;

  const channelsRaw = useLiveQuery<any>(
    db,
    sql,
    selectedCategory ? [currentUserId, selectedCategory] : [currentUserId],
    [TOPIC.CHANNELS]
  );

  const channels: any[] = Array.isArray(channelsRaw) ? channelsRaw : [];

  const onSelect = (item: any) => {
    router.push({ pathname: '/nachrichten/channel/[cid]', params: { cid: item.id } });
  };

  return (
    <View style={styles.container}>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        iconSize={iconSize}
      />

      {channels.length === 0 ? (
        <EmptyList
          selectedCategory={selectedCategory}
          onResetFilter={() => setSelectedCategory(null)}
        />
      ) : (
        <FlatList
          data={channels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChannelPreview
              channel={item}
              onSelect={onSelect}
              currentUserId={currentUserId}
              unreadCount={unreadByChannel?.[item.id] ?? 0}
            />
          )}
          contentContainerStyle={styles.channelList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingAnimation: { width: 200, height: 200 },
  spinner: { marginTop: 20 },
  channelList: { paddingBottom: 20 },
});