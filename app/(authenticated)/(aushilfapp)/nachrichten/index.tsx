import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '@/components/stores/AuthStore';
import ChannelPreview from '@/components/Channel/ChannelPreview';
import { Channel as StreamChannel } from 'stream-chat';
import { ChannelFilters } from 'stream-chat';
import { router } from 'expo-router';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';

function ChannelList() {
  const { streamChatClient } = useAuthStore();
  const [allChannels, setAllChannels] = useState<StreamChannel[]>([]);
  const [channels, setChannels] = useState<StreamChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { fontSize } = useContext(FontSizeContext);
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 18; // Ausgangsschriftgröße für das Label
  const maxFontSize = 45; // Passen Sie diesen Wert nach Bedarf an
  const minIconSize = 75;
  const maxIconSize = 280;
  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);



  const fetchChannels = async () => {
    if (!streamChatClient) return;

    try {
      const filters: ChannelFilters = {
        type: 'messaging',
        members: { $in: [streamChatClient.userID || ''] },
      };

      const response = await streamChatClient.queryChannels(filters);

      setAllChannels(response);
      if (selectedCategory) {
        setChannels(
          response.filter(
            (channel) => channel.data?.custom_post_category === selectedCategory
          )
        );
      } else {
        setChannels(response);
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Kanäle:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [streamChatClient]);

  useEffect(() => {
    if (selectedCategory) {
      setChannels(
        allChannels.filter(
          (channel) => channel.data?.custom_post_category === selectedCategory
        )
      );
    } else {
      setChannels(allChannels);
    }
  }, [selectedCategory, allChannels]);

  useEffect(() => {
    if (!streamChatClient) return;

    const handleChannelEvent = (event: any) => {
      const eventChannel = event.channel as StreamChannel;

      if (!eventChannel || !eventChannel.cid) {
        console.warn('Event ohne gültigen Channel empfangen:', event);
        return;
      }

      setAllChannels((prevAllChannels) => {
        let updatedAllChannels = [...prevAllChannels];

        switch (event.type) {
          case 'channel.created':
            if (eventChannel?.state?.members[streamChatClient.userID || '']) {
              const channelExists = updatedAllChannels.find(
                (channel) => channel.cid === eventChannel.cid
              );
              if (!channelExists) {
                updatedAllChannels = [eventChannel, ...updatedAllChannels];
              }
            }
            break;

          case 'channel.deleted':
            updatedAllChannels = updatedAllChannels.filter(
              (channel) => channel.cid !== eventChannel.cid
            );
            break;

          case 'channel.updated':
            updatedAllChannels = updatedAllChannels.map((channel) =>
              channel.cid === eventChannel.cid ? eventChannel : channel
            );
            break;

          case 'message.new':
            updatedAllChannels = updatedAllChannels.filter(
              (channel) => channel.cid !== eventChannel.cid
            );
            updatedAllChannels = [eventChannel, ...updatedAllChannels];
            break;

          default:
            break;
        }

        // Aktualisiere die gefilterten Kanäle basierend auf der ausgewählten Kategorie
        if (selectedCategory) {
          setChannels(
            updatedAllChannels.filter(
              (channel) => channel.data?.custom_post_category === selectedCategory
            )
          );
        } else {
          setChannels(updatedAllChannels);
        }

        return updatedAllChannels;
      });
    };

    const subscriptions = [
      streamChatClient.on('channel.created', handleChannelEvent),
      streamChatClient.on('channel.updated', handleChannelEvent),
      streamChatClient.on('channel.deleted', handleChannelEvent),
      streamChatClient.on('message.new', handleChannelEvent),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [streamChatClient, selectedCategory]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (

    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {['garten', 'haushalt', 'gastro', 'soziales'].map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() =>
              setSelectedCategory(selectedCategory === category ? null : category)
            }
            style={[
              styles.iconContainer,
              selectedCategory === category && getBackgroundForCategory(category),
            ]}
          >
            <Image source={getIconForCategory(category)} style={[styles.icon, { width: iconSize, height: iconSize }]} />
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={channels}
        keyExtractor={(item) => item.cid}
        renderItem={({ item }) => (
          <ChannelPreview
            channel={item}
            onSelect={(channel) => {
              router.push({
                pathname: '/nachrichten/channel/[cid]',
                params: { cid: channel.cid },
              });
            }}
          />
        )}
        />
      </View>

  );
}
const getBackgroundForCategory = (category: string) => {
  switch (category) {
    case 'garten':
      return { backgroundColor: 'lightgreen' };
    case 'haushalt':
      return { backgroundColor: 'lightblue' };
    case 'gastro':
      return { backgroundColor: 'rgb(255, 255, 102)' };
    case 'soziales':
      return { backgroundColor: 'rgb(255, 102, 102)' };
    default:
      return { backgroundColor: 'transparent' };
  }
};
const getIconForCategory = (category: string) => {
  switch (category) {
    case 'garten':
      return require('@/assets/images/GartenIcon.png');
    case 'haushalt':
      return require('@/assets/images/HaushaltIcon.png');
    case 'gastro':
      return require('@/assets/images/GastroIcon.png');
    case 'soziales':
      return require('@/assets/images/SozialesIcon.png');
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: 'white',
  },
  iconContainer: {
    padding: 10,

    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 25,

  },
  selectedIconContainer: {
    backgroundColor: 'lightblue',
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default ChannelList;