// useChatListeners.ts
import { useEffect } from 'react';
import { Event, Channel, DefaultGenerics } from 'stream-chat';
import { FormatMessageResponse } from 'stream-chat';
import { ChatMessage } from '@/components/types/stream';
import { StoredMessage } from '@/components/Crud/SQLite/Services/messagesService';
import { useChannelServices } from '@/components/Crud/SQLite/Services/channelServices';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { logger } from '@/components/utils/logger';

export const useChatListeners = (
  streamChatClient: any,
  activeCid: string | null,
  setActiveMessages: (msgs: ChatMessage[]) => void,
  setZustandChannels: (chs: any[]) => void,
  db: any,
  user: any,
  activeMessages: ChatMessage[]
) => {
  const { getChannelsFromDb, mapChannelToDbValues } = useChannelServices();
  const { mapMessageToDbValues, saveMessagesToDb } = useMessagesService(db);

  useEffect(() => {
    let isActive = true;
    if (!streamChatClient) return;

    const handleNewMessage = async (event: Event<DefaultGenerics>) => {
      if (!isActive || !streamChatClient || !user) return;
      logger.info('Event: message.new', event);
      try {
        const msg = event.message as unknown as FormatMessageResponse;
        const [type, id] = event.cid?.split(':') || [];
        const channel = streamChatClient.channel(type, id);

        const stored = await mapMessageToDbValues(msg, channel);
        if (!isActive || !streamChatClient || !user) return;
        await saveMessagesToDb([stored]);
        if (!isActive || !streamChatClient || !user) return;

        if (event.cid === activeCid) {
          if (activeMessages.some((m: ChatMessage) => m.id === stored.id)) return;
          const next = [...activeMessages, stored as unknown as ChatMessage];
          next.sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          setActiveMessages(next);
        }

        const vals = mapChannelToDbValues(channel);
        await db.runAsync(
          `INSERT OR REPLACE INTO channels_fetched (
            cid, meId, channel_id, channel_type, custom_post_option,
            custom_post_category, custom_post_id, custom_post_user_id,
            custom_post_vorname, custom_post_nachname, custom_post_profileImage,
            custom_post_userBio, custom_user_vorname, custom_user_nachname,
            custom_user_profileImage, custom_user_userBio, custom_user_id,
            last_message_text, last_message_at, updated_at, created_at,
            unread_count, partner_user_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          Object.values(vals)
        );
        if (!isActive || !streamChatClient || !user) return;
        const localChs = await getChannelsFromDb(db, user?.id ?? '');
        if (!isActive || !streamChatClient || !user) return;
        setZustandChannels(localChs);
      } catch (e) {
        logger.error('Subscription New Message Error:', e);
      }
    };

    const handleChannelUpdate = async (event: Event) => {
      if (!isActive || !streamChatClient || !user) return;
      logger.info('Event: channel.updated', event);
      try {
        const channel = event.channel as unknown as Channel;
        const vals = mapChannelToDbValues(channel);
        await db.runAsync(
          `INSERT OR REPLACE INTO channels_fetched (
            cid, meId, channel_id, channel_type, custom_post_option,
            custom_post_category, custom_post_id, custom_post_user_id,
            custom_post_vorname, custom_post_nachname, custom_post_profileImage,
            custom_post_userBio, custom_user_vorname, custom_user_nachname,
            custom_user_profileImage, custom_user_userBio, custom_user_id,
            last_message_text, last_message_at, updated_at, created_at,
            unread_count, partner_user_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          Object.values(vals)
        );
        if (!isActive || !streamChatClient || !user) return;
        const localChs = await getChannelsFromDb(db, user?.id ?? '');
        if (!isActive || !streamChatClient || !user) return;
        setZustandChannels(localChs);
      } catch (e) {
        logger.error('Subscription Channel Update Error:', e);
      }
    };

    const subNew = streamChatClient.on('message.new', handleNewMessage);
    const subUpd = streamChatClient.on('channel.updated', handleChannelUpdate);

    return () => {
      isActive = false;
      subNew.unsubscribe();
      subUpd.unsubscribe();
    };
  }, [streamChatClient, activeCid]);
};