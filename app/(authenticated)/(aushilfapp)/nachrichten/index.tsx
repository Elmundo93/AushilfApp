// app/(authenticated)/(aushilfapp)/nachrichten/index.tsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { CategoryFilter } from '@/components/Nachrichten/CategoryFilter';
import ChannelPreview from '@/components/Nachrichten/Channel/ChannelPreview';
import LottieView from 'lottie-react-native';
import EmptyList from '@/components/Nachrichten/Costum/EmptyList';

import { useChannelLocalStore } from '@/components/stores/useChannelLocalStore';

function filterByCategory(channels: any[], category: string | null) {
  if (!category) return channels;
  return channels.filter((c) => (c.custom_category ?? '').toLowerCase() === category.toLowerCase());
}

export default function ChannelList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { fontSize } = useContext(FontSizeContext);

  const { channels, loading, initialized, loadLocal, syncOnce, startRealtime } = useChannelLocalStore();

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      await loadLocal();
      await syncOnce();
      unsub = startRealtime();
    })();
    return () => unsub();
  }, [loadLocal, syncOnce, startRealtime]);

  const minIconSize = 75;
  const maxIconSize = 280;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  const list = useMemo(() => filterByCategory(channels, selectedCategory), [channels, selectedCategory]);

  const onSelect = (item: any) => {
    // ChannelPreview soll die echte ID bekommen — kein Mapping
    router.push({ pathname: '/nachrichten/channel/[cid]', params: { cid: item.id } });
  };

  return (
    <View style={styles.container}>
      {loading && !initialized ? (
        <View style={styles.loadingContainer}>
          <LottieView source={require('@/assets/animations/LoadingWarp.json')} autoPlay loop style={styles.loadingAnimation} />
          <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        </View>
      ) : (
        <>
          <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} iconSize={iconSize} />
          {list.length === 0 ? (
            <EmptyList selectedCategory={selectedCategory} onResetFilter={() => setSelectedCategory(null)} />
          ) : (
            <FlatList
              data={list}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChannelPreview
                  channel={item}
                  onSelect={onSelect}
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
  container: { flex: 1, backgroundColor: 'white' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingAnimation: { width: 200, height: 200 },
  spinner: { marginTop: 20 },
  channelList: { paddingBottom: 20 },
});