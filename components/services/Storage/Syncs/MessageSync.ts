// services/Storage/Syncs/MessageSync.ts
import { useAuthStore } from '@/components/stores/AuthStore';
import { StoredMessage } from '@/components/Crud/SQLite/Services/messagesService';
import { ChatMessage } from '@/components/types/stream';
import { Channel } from 'stream-chat';
import { useEffect } from 'react';
import { MessageResponse, DefaultGenerics } from 'stream-chat';
import { useSQLiteContext } from 'expo-sqlite';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';

const transformMessage = (msg: MessageResponse<DefaultGenerics>, cid: string): StoredMessage => {
  const sender = msg.user as any;
  const read = (msg.read_by as Array<{ id: string }>)?.some(u => u.id === useAuthStore.getState().streamChatClient?.userID) ? 1 : 0;

  return {
    id: msg.id || '',
    cid,
    sender_id: sender?.id || '',
    sender_vorname: sender?.vorname || '',
    sender_nachname: sender?.nachname || '',
    sender_image: sender?.image || '',
    content: msg.text || '',
    created_at: msg.created_at || '',
    read: read,
  };
};

export function useMessageSync() {
  const db = useSQLiteContext();
  const messagesService = useMessagesService(db);

  const syncMessagesForChannel = async (cid: string) => {
    try {
      const client = useAuthStore.getState().streamChatClient;
      if (!client) throw new Error('Kein Client verfügbar');

      const [type, id] = cid.split(':');
      const channel = client.channel(type, id);
      await channel.watch();

      const { messages } = await channel.query({ messages: { limit: 50 } });
      const transformed = messages.map((msg) => transformMessage(msg, cid));
      await messagesService.saveMessagesToDb(transformed);
    } catch (err) {
      console.error(`❌ Fehler beim Sync von Channel ${cid}:`, err);
    }
  };

  const syncMessagesForAllChannels = async () => {
    try {
      const client = useAuthStore.getState().streamChatClient;
      if (!client) throw new Error('Kein Client verfügbar');

      const filters = {
        type: 'messaging',
        members: { $in: [client.userID ?? ''] },
      };

      const channels: Channel[] = await client.queryChannels(filters);

      for (const channel of channels) {
        const cid = channel.cid;
        const { messages } = await channel.query({ messages: { limit: 50 } });
        const transformed = messages.map((msg) => transformMessage(msg, cid));
        await messagesService.saveMessagesToDb(transformed);
      }
    } catch (err) {
      console.error('❌ Fehler beim Sync aller Nachrichten:', err);
    }
  };

  const subscribeToNewMessages = () => {
    const client = useAuthStore.getState().streamChatClient;
    if (!client) return;

    const onNewMessage = async (event: any) => {
      try {
        const msg = event.message;
        const cid = event.cid;
        if (!msg || !cid) return;
        const transformed = transformMessage(msg, cid);
        await messagesService.saveMessagesToDb([transformed]);
      } catch (err) {
        console.error('❌ Fehler beim Speichern neuer Nachricht:', err);
      }
    };

    const sub = client.on('message.new', onNewMessage);

    return () => {
      sub.unsubscribe();
    };
  };

  return {
    syncMessagesForChannel,
    syncMessagesForAllChannels,
    subscribeToNewMessages
  };
}