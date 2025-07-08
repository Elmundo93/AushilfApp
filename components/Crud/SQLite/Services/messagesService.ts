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
  post_category: string;
  post_option: string;
  post_vorname: string;
  post_nachname: string;
  post_image: string;
  content: string;
  created_at: string;
  read: number;
  custom_type?: 'initial' | 'message' | 'system' | string; // sauberer
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
        custom_type: '',
        content: '',
        created_at: '',
        read: 0,
        post_category: '',
        post_option: '',
        post_vorname: '',
        post_nachname: '',
        post_image: '',

      };
    }
    try {
      const sender = (message.user as any) || {};
      const read = (message.read_by as Array<{ id: string }>)?.some(
        (u) => u.id === channel.getClient().userID
      )
        ? 1
        : 0;

      const mappedMessage = {
        id: message.id || '',
        cid: channel.cid || '',
        post_category: message.custom_post_category as string || '',
        post_option: message.custom_post_option as string || '',
        post_vorname: message.custom_post_vorname as string || '',
        post_nachname: message.custom_post_nachname as string || '',
        post_image: message.custom_post_profileImage as string || '',
        sender_id: sender?.id || '',
        sender_vorname: sender?.vorname || '',
        sender_nachname: sender?.nachname || '',
        custom_type: message.custom_type as 'initial' | 'message' | 'system' | string || 'message',
        sender_image: sender?.image || '',
        content: message.text || '',
        created_at: formatMaybeDate(message.created_at) || '',
        read,
      };

      // console.log('📨 Message Mapping Details:', {
      //   id: mappedMessage.id,
      //   cid: mappedMessage.cid,
      //   sender: {
      //     id: mappedMessage.sender_id,
      //     name: `${mappedMessage.sender_vorname} ${mappedMessage.sender_nachname}`,
      //     image: mappedMessage.sender_image
      //   },
      //   content: mappedMessage.content?.substring(0, 100) + '...',
      //   custom_type: mappedMessage.custom_type,
      //   read: mappedMessage.read === 1 ? 'gelesen' : 'ungelesen',
      //   created_at: mappedMessage.created_at
      // });

      return mappedMessage;
    } catch (e) {
      console.error('[ERROR] mapMessageToDbValues failed:', e);
      return {
        id: '',
        cid: '',
        sender_id: '',
        post_category: '',
        post_option: '',
        post_vorname: '',
        post_nachname: '',
        post_image: '',
        sender_vorname: '',
        sender_nachname: '',
        sender_image: '',
        custom_type: '',
        content: '',
        created_at: '',
        read: 0,
      };
    }
  };

  const saveMessagesToDb = async (messages: StoredMessage[], skipTransaction = false): Promise<void> => {
    try {
      console.log(`🔄 Speichere ${messages.length} Messages in SQLite (optimiert)...`);
      
      const saveOperation = async () => {
        if (messages.length === 0) {
          console.log('📝 Keine Messages zum Speichern');
          return;
        }

        // Batch-Insert für bessere Performance
        const messageValues = messages.map(msg => 
          `('${msg.id}', '${msg.cid}', '${msg.sender_id}', '${msg.sender_vorname?.replace(/'/g, "''") || ''}', '${msg.sender_nachname?.replace(/'/g, "''") || ''}', '${msg.sender_image || ''}', '${msg.content?.replace(/'/g, "''") || ''}', '${msg.created_at}', ${msg.read}, '${msg.custom_type || 'message'}', '${msg.post_category || ''}', '${msg.post_option || ''}', '${msg.post_vorname?.replace(/'/g, "''") || ''}', '${msg.post_nachname?.replace(/'/g, "''") || ''}', '${msg.post_image || ''}')`
        ).join(',');
        
        await db.runAsync(`
          INSERT OR IGNORE INTO messages_fetched (
            id, cid, sender_id, sender_vorname, sender_nachname, sender_image,
            content, created_at, read, custom_type, post_category, post_option, post_vorname, post_nachname, post_image
          ) VALUES ${messageValues}
        `);
        
        // Überprüfe tatsächlich eingefügte Messages
        const insertedCount = await db.getFirstAsync<{ count: number }>(
          'SELECT COUNT(*) as count FROM messages_fetched WHERE id IN (' + 
          messages.map(m => `'${m.id}'`).join(',') + ')'
        );
        
        const skippedCount = messages.length - (insertedCount?.count || 0);
        console.log(`📊 Messages: ${insertedCount?.count || 0} gespeichert, ${skippedCount} übersprungen`);
      };

      if (skipTransaction) {
        await saveOperation();
      } else {
        // Use dbMutex to prevent nested transactions and handle connection issues
        await dbMutex.runExclusive(async () => {
          try {
            await db.withTransactionAsync(saveOperation);
          } catch (transactionError) {
            console.error('❌ Transaction error in saveMessagesToDb:', transactionError);
            // Fallback: try without transaction
            console.log('🔄 Retrying without transaction...');
            await saveOperation();
          }
        });
      }
    } catch (error) {
      console.error('❌ Fehler beim Speichern von Nachrichten:', error);
      // Don't throw the error to prevent app crashes
      console.warn('⚠️ Continuing despite message save error');
    }
  };

  const getMessagesForChannel = async (
    cid: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<StoredMessage[]> => {
    try {
      console.log(`🔍 Lade Messages für Channel: ${cid} (Limit: ${limit}, Offset: ${offset})`);
      
      const rows = await db.getAllAsync<StoredMessage>(
        `SELECT * FROM messages_fetched
         WHERE cid = ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?;`,
        [cid, limit, offset]
      );
      
      const messages = rows || [];
      console.log(`📋 ${messages.length} Messages für Channel ${cid} geladen:`, messages.map(m => ({
        id: m.id,
        sender: `${m.sender_vorname} ${m.sender_nachname}`,
        content: m.content?.substring(0, 50) + '...',
        created_at: m.created_at,
        read: m.read === 1 ? 'gelesen' : 'ungelesen'
      })));
      
      return messages;
    } catch (error) {
      console.error('❌ Fehler beim Laden der Nachrichten:', error);
      return [];
    }
  };

  // Neue Funktion: Alle Messages debuggen
  const debugAllMessages = async (): Promise<void> => {
    try {
      console.log('🔍 === DEBUG: ALLE MESSAGES ===');
      
      const messages = await db.getAllAsync<StoredMessage>('SELECT * FROM messages_fetched ORDER BY created_at DESC');
      console.log(`💬 Messages (${messages?.length || 0}):`, messages);
      
      if (messages && messages.length > 0) {
        console.log('📋 Erste 5 Messages:', messages.slice(0, 5).map(m => ({
          id: m.id,
          cid: m.cid,
          sender: `${m.sender_vorname} ${m.sender_nachname}`,
          content: m.content?.substring(0, 100),
          created_at: m.created_at,
          read: m.read
        })));
      }
      
      console.log('🔍 === ENDE DEBUG MESSAGES ===');
    } catch (error) {
      console.error('❌ Fehler beim Debug-Loading der Messages:', error);
    }
  };

  // Neue Funktion: Messages für spezifischen Channel debuggen
  const debugMessagesForChannel = async (cid: string): Promise<void> => {
    try {
      console.log(`🔍 === DEBUG MESSAGES FÜR CHANNEL: ${cid} ===`);
      
      const messages = await db.getAllAsync<StoredMessage>(
        'SELECT * FROM messages_fetched WHERE cid = ? ORDER BY created_at DESC',
        [cid]
      );
      
      console.log(`💬 Messages für ${cid} (${messages?.length || 0}):`, messages);
      
      if (messages && messages.length > 0) {
        console.log('📋 Alle Messages für Channel:', messages.map(m => ({
          id: m.id,
          sender: `${m.sender_vorname} ${m.sender_nachname}`,
          content: m.content,
          created_at: m.created_at,
          read: m.read === 1 ? 'gelesen' : 'ungelesen'
        })));
      }
      
      console.log(`🔍 === ENDE DEBUG MESSAGES FÜR ${cid} ===`);
    } catch (error) {
      console.error(`❌ Fehler beim Debug-Loading der Messages für ${cid}:`, error);
    }
  };

  return {
    mapMessageToDbValues,
    saveMessagesToDb,
    getMessagesForChannel,
    debugAllMessages,
    debugMessagesForChannel,
  };
}