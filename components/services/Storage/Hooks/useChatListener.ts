// useChatListeners.ts
import { useEffect, useRef } from 'react';
import { Event, Channel, DefaultGenerics } from 'stream-chat';
import { FormatMessageResponse } from 'stream-chat';
import { ChatMessage } from '@/components/types/stream';
import { StoredMessage } from '@/components/Crud/SQLite/Services/messagesService';
import { useChannelServices } from '@/components/Crud/SQLite/Services/channelServices';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { logger } from '@/components/utils/logger';
import { dbMutex } from '@/components/Crud/SQLite/Services/dbMutex';

export const useChatListeners = (
  streamChatClient: any,
  activeCid: string | null,
  addMessage: (message: ChatMessage) => void,
  setZustandChannels: (chs: any[]) => void,
  db: any,
  user: any,
  activeMessages: ChatMessage[]
) => {
  const { getChannelsFromDb, mapChannelToDbValues } = useChannelServices();
  const { mapMessageToDbValues, saveMessagesToDb } = useMessagesService(db);
  const activeMessagesRef = useRef(activeMessages);

  // Update ref when activeMessages changes
  activeMessagesRef.current = activeMessages;

  // Helper function to validate category
  const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
  const isValidCategory = (category: string) => validCategories.includes(category);

  useEffect(() => {
    let isActive = true;
    if (!streamChatClient) return;

    const handleNewMessage = async (event: Event<DefaultGenerics>) => {
      if (!isActive || !streamChatClient || !user) return;
      
      try {
        const msg = event.message as unknown as FormatMessageResponse;
        const [type, id] = event.cid?.split(':') || [];
        const channel = streamChatClient.channel(type, id);

        const stored = await mapMessageToDbValues(msg, channel);
        if (!isActive || !streamChatClient || !user) return;
        
        // Wrap both message and channel updates in a single transaction
        try {
          await dbMutex.runExclusive(async () => {
            await db.withTransactionAsync(async () => {
              await saveMessagesToDb([stored], true); // Skip transaction since we're already in one
              
              const vals = mapChannelToDbValues(channel);
              
              // Check if this channel already exists and has a valid user-chosen category
              const existingChannel = await db.getFirstAsync(
                'SELECT custom_post_category_choosen FROM channels_fetched WHERE cid = ?',
                [vals.cid]
              ) as { custom_post_category_choosen: string } | undefined;
              
              // Only preserve existing user choice if it's a valid category
              if (existingChannel && existingChannel.custom_post_category_choosen && isValidCategory(existingChannel.custom_post_category_choosen)) {
                vals.custom_post_category_choosen = existingChannel.custom_post_category_choosen;
              }
              
              await db.runAsync(
                `INSERT OR REPLACE INTO channels_fetched (
                  cid, meId, channel_id, channel_type, custom_post_category_choosen,
                  custom_post_option, custom_post_category, custom_post_id, custom_post_user_id,
                  custom_post_vorname, custom_post_nachname, custom_post_profileImage,
                  custom_post_userBio, custom_user_vorname, custom_user_nachname,
                  custom_user_profileImage, custom_user_userBio, custom_user_id,
                  last_message_text, last_message_at, updated_at, created_at,
                  unread_count, partner_user_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                Object.values(vals)
              );
            });
          });
        } catch (transactionError) {
          console.warn('⚠️ Transaction failed, continuing without database update:', transactionError);
        }

        // Only update active messages if this is the active channel AND message doesn't exist
        if (event.cid === activeCid && !activeMessagesRef.current.some((m: ChatMessage) => m.id === stored.id)) {
          // Use addMessage instead of setMessages for better performance
          const newMessage = stored as unknown as ChatMessage;
          addMessage(newMessage); // This will be handled by the store's addMessage logic
        }

        // Only update channel list if this is a new message (not just a channel update)
        if (!isActive || !streamChatClient || !user) return;
        
        // Optimized: Only reload channels occasionally, not on every message
        const shouldUpdateChannels = Math.random() < 0.1; // 10% chance to update channels
        if (shouldUpdateChannels) {
          try {
            const localChs = await getChannelsFromDb(db, user?.id ?? '');
            if (!isActive || !streamChatClient || !user) return;
            setZustandChannels(localChs);
          } catch (error) {
            console.warn('⚠️ Channel list update failed:', error);
          }
        }
      } catch (e) {
        logger.error('Subscription New Message Error:', e);
      }
    };

    const handleChannelUpdate = async (event: Event) => {
      if (!isActive || !streamChatClient || !user) return;
      
      try {
        const channel = event.channel as unknown as Channel;
        const vals = mapChannelToDbValues(channel);
        
        // Check if this channel already exists and has a valid user-chosen category
        const existingChannel = await db.getFirstAsync(
          'SELECT custom_post_category_choosen FROM channels_fetched WHERE cid = ?',
          [vals.cid]
        ) as { custom_post_category_choosen: string } | undefined;
        
        // Only preserve existing user choice if it's a valid category
        if (existingChannel && existingChannel.custom_post_category_choosen && isValidCategory(existingChannel.custom_post_category_choosen)) {
          vals.custom_post_category_choosen = existingChannel.custom_post_category_choosen;
        }
        
        await db.runAsync(
          `INSERT OR REPLACE INTO channels_fetched (
            cid, meId, channel_id, channel_type, custom_post_category_choosen,
            custom_post_option, custom_post_category, custom_post_id, custom_post_user_id,
            custom_post_vorname, custom_post_nachname, custom_post_profileImage,
            custom_post_userBio, custom_user_vorname, custom_user_nachname,
            custom_user_profileImage, custom_user_userBio, custom_user_id,
            last_message_text, last_message_at, updated_at, created_at,
            unread_count, partner_user_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          Object.values(vals)
        );
        
        // Only update channel list occasionally for channel updates too
        if (!isActive || !streamChatClient || !user) return;
        const shouldUpdateChannels = Math.random() < 0.05; // 5% chance for channel updates
        if (shouldUpdateChannels) {
          const localChs = await getChannelsFromDb(db, user?.id ?? '');
          if (!isActive || !streamChatClient || !user) return;
          setZustandChannels(localChs);
        }
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
  }, [streamChatClient, activeCid]); // Removed activeMessages from dependencies to prevent loops
};