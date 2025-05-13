// services/Storage/Syncs/DanksagungsService.ts
import { useSQLiteContext } from 'expo-sqlite';
import { fetchDanksagungen } from '@/components/Crud/Danksagungen/fetchDanksagung';
import { Danksagung } from '@/components/types/Danksagungen';
import { Location } from '@/components/types/location';

export function useDanksagungenService() {
  const db = useSQLiteContext();

  async function getDanksagungen(): Promise<Danksagung[]> {
    return db.getAllAsync<Danksagung>('SELECT * FROM danksagungen_fetched;');
  }

  async function addDanksagungen(location: Location) {
    const arr = await fetchDanksagungen(location);
    console.log('Fetched danksagungen:', arr);

    try {
      await db.withTransactionAsync(async () => {
        // ← use runAsync, not execAsync
        await db.runAsync('DELETE FROM danksagungen_fetched;', []);
        for (const d of arr) {
          await db.runAsync(
            `INSERT OR REPLACE INTO danksagungen_fetched (
               id, created_at, vorname, nachname, writtenText,
               userId, location, authorId, long, lat, profileImageUrl
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              d.id,
              d.created_at,
              d.vorname,
              d.nachname,
              d.writtenText,
              d.userId,
              d.location,
              d.authorId,
              d.long,
              d.lat,
              d.profileImageUrl,
            ]
          );
        }
      });
      console.log('✅ Danksagungen in SQLite gespeichert');
    } catch (error) {
      console.error('❌ Error storing fetched danksagungen:', error);
      throw error;
    }
  }

  return { getDanksagungen, addDanksagungen };
}