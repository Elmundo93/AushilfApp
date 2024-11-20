import { useSQLiteContext } from 'expo-sqlite';

export function useMessagesService() {
  const db = useSQLiteContext();

  async function getMessages() {
    return await db.getAllAsync<{ id: number; title: string; content: string }>('SELECT * FROM messages');
  }

  async function addMessages(title: string, content: string) {
    await db.runAsync('INSERT INTO messages (title, content) VALUES (?, ?)', title, content);
  }

  return { getMessages, addMessages };
}
