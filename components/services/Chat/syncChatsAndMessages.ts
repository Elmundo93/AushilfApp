import { supabase } from '@/lib/supabase';
import { openDatabase } from 'expo-sqlite';

const db = openDatabase('your-db-name.db');

export async function syncChatsAndMessages(userId: string) {
  try {
    // 1. Alle Chats des Users laden
    const { data: chats, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .or(`user1.eq.${userId},user2.eq.${userId}`);

    if (chatError) throw chatError;

    // 2. In SQLite speichern
    const chatInsertQueries = chats.map(chat => [
      chat.id, chat.user1, chat.user2, chat.blocked_by, chat.created_at
    ]);

    await db.execAsync('BEGIN TRANSACTION;');
    for (const row of chatInsertQueries) {
      await db.runAsync(
        `INSERT OR REPLACE INTO chats_fetched (id, user1, user2, blocked_by, created_at) VALUES (?, ?, ?, ?, ?)`,
        row
      );
    }

    // 3. Nachrichten aller Chats laden
    const chatIds = chats.map(chat => `'${chat.id}'`).join(',');
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .in('chat_id', chats.map(c => c.id));

    if (msgError) throw msgError;

    const messageInsertQueries = messages.map(msg => [
      msg.id, msg.chat_id, msg.sender_id, msg.content, msg.created_at, msg.read ? 1 : 0
    ]);

    for (const row of messageInsertQueries) {
      await db.runAsync(
        `INSERT OR REPLACE INTO messages_fetched (id, chat_id, sender_id, content, created_at, read) VALUES (?, ?, ?, ?, ?, ?)`,
        row
      );
    }

    await db.execAsync('COMMIT;');

    console.log('✅ Chats & Nachrichten synchronisiert.');

  } catch (error) {
    console.error('❌ Fehler beim Synchronisieren:', error);
    await db.execAsync('ROLLBACK;');
  }
}