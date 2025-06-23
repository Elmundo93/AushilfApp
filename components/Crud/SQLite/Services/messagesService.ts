// components/services/sqlite/messageService.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { Channel, FormatMessageResponse } from 'stream-chat';
import { dbMutex } from './dbMutex';

export interface StoredMessage {
  id: string;
  cid: string;
  sender_id: string;
  sender_vorname: string;
  sender_nachname: string;
  sender_image: string;
  content: string;
  created_at: string;
  read: number;
}

function formatMaybeDate(input: string | Date | undefined | null): string | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function useMessagesService(db: SQLiteDatabase) {
  const mapMessageToDbValues = async (
    message: FormatMessageResponse,
    channel: Channel
  ): Promise<StoredMessage> => {
    if (!message || !channel) {
      console.warn('[WARN] mapMessageToDbValues: message oder channel ist undefined/null');
      return {
        id: '',
        cid: '',
        sender_id: '',
        sender_vorname: '',
        sender_nachname: '',
        sender_image: '',
        content: '',
        created_at: '',
        read: 0,
      };
    }
    try {
      const sender = (message.user as any) || {};
      const read = (message.read_by as Array<{ id: string }>)?.some(
        (u) => u.id === channel.getClient().userID
      )
        ? 1
        : 0;

      return {
        id: message.id || '',
        cid: channel.cid || '',
        sender_id: sender?.id || '',
        sender_vorname: sender?.vorname || '',
        sender_nachname: sender?.nachname || '',
        sender_image: sender?.image || '',
        content: message.text || '',
        created_at: formatMaybeDate(message.created_at) || '',
        read,
      };
    } catch (e) {
      console.error('[ERROR] mapMessageToDbValues failed:', e);
      return {
        id: '',
        cid: '',
        sender_id: '',
        sender_vorname: '',
        sender_nachname: '',
        sender_image: '',
        content: '',
        created_at: '',
        read: 0,
      };
    }
  };

  const saveMessagesToDb = async (messages: StoredMessage[]): Promise<void> => {
    try {
      await dbMutex.runExclusive(async () => {
        await db.withTransactionAsync(async () => {
          for (const msg of messages) {
            const exists = await db.getFirstAsync(
              `SELECT 1 FROM messages_fetched WHERE id = ? LIMIT 1;`,
              [msg.id]
            );
            if (exists) {
              if (process.env.NODE_ENV === 'development') {
                console.debug('[DEBUG] Duplicate message skipped:', msg.id);
              }
              continue;
            }
            await db.runAsync(
              `INSERT INTO messages_fetched (
                 id, cid, sender_id, sender_vorname, sender_nachname, sender_image,
                 content, created_at, read
               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              Object.values(msg)
            );
          }
        });
      });
    } catch (error) {
      console.error('❌ Fehler beim Speichern von Nachrichten:', error);
      throw error;
    }
  };

  const getMessagesForChannel = async (
    cid: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<StoredMessage[]> => {
    try {
      const rows = await db.getAllAsync<StoredMessage>(
        `SELECT * FROM messages_fetched
         WHERE cid = ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?;`,
        [cid, limit, offset]
      );
      return rows || [];
    } catch (error) {
      console.error('❌ Fehler beim Laden der Nachrichten:', error);
      return [];
    }
  };

  return {
    mapMessageToDbValues,
    saveMessagesToDb,
    getMessagesForChannel,
  };
}