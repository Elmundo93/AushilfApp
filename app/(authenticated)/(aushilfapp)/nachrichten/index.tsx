import React, { useContext, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Channel as StreamChannel } from 'stream-chat';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import ChannelPreview from '@/components/Nachrichten/Channel/ChannelPreview';
import { CategoryFilter } from '@/components/Nachrichten/CategoryFilter';
import { useChannels } from '@/components/services/StreamChat/useChannels';

function ChannelList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { fontSize } = useContext(FontSizeContext);
  const { channels, loading } = useChannels(selectedCategory);

  
  const minIconSize = 75;
  const maxIconSize = 280;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleChannelSelect = (channel: StreamChannel) => {
    router.push({
      pathname: '/nachrichten/channel/[cid]',
      params: { cid: channel.cid },
    });
  };

  console.log(channels);

  return (
    <View style={styles.container}>
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
            channel={item}
            onSelect={handleChannelSelect}
          />
        )}
      />
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