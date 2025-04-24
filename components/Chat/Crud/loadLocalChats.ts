import { openDatabase } from 'expo-sqlite';
import { useChatStore } from '@/stores/useChatStore';

const db = openDatabase('your-db-name.db');

export async function loadChatsFromSQLite() {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM chats_fetched`,
        [],
        (_, { rows }) => {
          const chats = rows._array;
          useChatStore.getState().setChats(chats);
          resolve();
        },
        (_, error) => {
          console.error('Fehler beim Laden der Chats:', error);
          reject(error);
          return true;
        }
      );
    });
  });
}