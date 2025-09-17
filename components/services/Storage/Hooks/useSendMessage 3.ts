// useSendMessage.ts
import { useAuthStore } from '@/components/stores/AuthStore';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { FormatMessageResponse } from 'stream-chat';
import { ChatMessage } from '@/components/types/stream';
import { SQLiteDatabase } from 'expo-sqlite';
import { useChannelServices } from '@/components/Crud/SQLite/Services/channelServices';
import { saveChannelObjects } from '@/components/Crud/SQLite/Services/channelServices';

export const useSendMessage = (db: SQLiteDatabase) => {
  const { streamChatClient, user } = useAuthStore();
  const { mapMessageToDbValues, saveMessagesToDb } = useMessagesService(db);

  return async (
    cid: string,
    text: string,
    tempId: string,
    setActiveMessages: (msgs: ChatMessage[]) => void,
    activeMessages: ChatMessage[]
  ) => {
    if (!streamChatClient || !user) return;

    const [type, id] = cid.split(':');
    const channel = streamChatClient.channel(type, id);

    try {
      // Send message to StreamChat
      const res = await channel.sendMessage({ text });
      
      // Map message to database format
      const stored = await mapMessageToDbValues(
        res.message as unknown as FormatMessageResponse,
        channel
      );

      // Save message to SQLite with robust error handling
      try {
        await saveMessagesToDb([stored]);
        console.log('✅ Message saved to SQLite successfully');
      } catch (sqliteError) {
        console.error('❌ Failed to save message to SQLite:', sqliteError);
        // Continue execution - message is still sent to StreamChat
      }

      // Update channel in SQLite with new message info
      try {
        const { mapChannelToDbValues, saveChannelObjects } = useChannelServices();
        const channelData = mapChannelToDbValues(channel);
        
        // Update channel with new message info
        channelData.last_message_text = text;
        channelData.last_message_at = new Date().toISOString();
        channelData.updated_at = new Date().toISOString();
        
        await saveChannelObjects(db, [channelData]);
        console.log('✅ Channel updated in SQLite after sending message');
      } catch (channelUpdateError) {
        console.error('❌ Failed to update channel in SQLite:', channelUpdateError);
        // Continue execution - message is still sent
      }

      // Update UI with new message
      const filtered = activeMessages.filter((m: ChatMessage) => m.id !== tempId && m.id !== stored.id);
      setActiveMessages([stored as unknown as ChatMessage, ...filtered]);
      
      console.log('✅ Message sent and processed successfully');
    } catch (e) {
      console.error('Send Message Error:', e);
      throw e; // Re-throw to let caller handle it
    }
  };
};