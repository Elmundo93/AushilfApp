// components/services/StreamChat/useChannels.ts
import { useState, useEffect } from 'react';
import { Channel as StreamChannel, ChannelFilters } from 'stream-chat';
import { useAuthStore } from '@/components/stores/AuthStore';

export const useChannels = (selectedCategory: string | null) => {
  const { streamChatClient } = useAuthStore();
  const [allChannels, setAllChannels] = useState<StreamChannel[]>([]);
  const [channels, setChannels] = useState<StreamChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial channels
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
        setChannels(response.filter(
          (channel) => channel.data?.custom_post_category === selectedCategory
        ));
      } else {
        setChannels(response);
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Kanäle:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch effect
  useEffect(() => {
    fetchChannels();
  }, [streamChatClient]);

  // Filter channels when category changes
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

  // Listen to channel events
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

    // Subscribe to channel events
    const subscriptions = [
      streamChatClient.on('channel.created', handleChannelEvent),
      streamChatClient.on('channel.updated', handleChannelEvent),
      streamChatClient.on('channel.deleted', handleChannelEvent),
      streamChatClient.on('message.new', handleChannelEvent),
    ];

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [streamChatClient, selectedCategory]);

  return { channels, loading };
};