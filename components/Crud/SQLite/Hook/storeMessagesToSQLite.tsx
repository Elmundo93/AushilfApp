// 📁 services/storeMessagesInSQLite.ts
import { openDatabaseSync } from 'expo-sqlite';
import { MessageResponse } from 'stream-chat';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';

const db = openDatabaseSync('your-db-name.db');

export async function storeMessagesInSQLite(chatId: string, messages: MessageResponse[]) {
  try {
    await db.execAsync('BEGIN TRANSACTION;');

    for (const message of messages) {
      await db.runAsync(
        `INSERT OR REPLACE INTO messages_fetched 
          (id, chat_id, sender_id, content, created_at, read)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          message.id,
          chatId,
          message.user?.id ?? '',
          message.text ?? '',
          message.created_at ?? new Date().toISOString(),
          1, // StreamChat kennt `read` nicht pro Nachricht, also erstmal als gelesen markieren
        ]
      );
    }

    await db.execAsync('COMMIT;');

    // Lokalen Zustand aktualisieren
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      chat_id: chatId,
      sender_id: msg.user?.id ?? '',
      content: msg.text ?? '',
      created_at: msg.created_at ?? new Date().toISOString(),
      read: true,
    }));

    useStreamChatStore.getState().setMessages(chatId, formattedMessages);
  } catch (error) {
    console.error('❌ Fehler beim Speichern der Nachrichten:', error);
    await db.execAsync('ROLLBACK;');
  }
}