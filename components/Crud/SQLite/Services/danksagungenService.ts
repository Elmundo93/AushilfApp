import { useSQLiteContext } from 'expo-sqlite';

export function useDanksagungenService() {
  const db = useSQLiteContext();

  async function getDanksagungen() {
    return await db.getAllAsync<{ id: number; title: string; content: string }>('SELECT * FROM danksagungen');
  }

  async function addDanksagungen(title: string, content: string) {
    await db.runAsync('INSERT INTO danksagungen (title, content) VALUES (?, ?)', title, content);
  }

  return { getDanksagungen, addDanksagungen };
}
