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

  async function getDanksagungenForUser(userId: string): Promise<Danksagung[]> {
    try {
      // console.log(`🔍 Fetching danksagungen for user: ${userId}`);
      const danksagungen = await db.getAllAsync<Danksagung>(
        'SELECT * FROM danksagungen_fetched WHERE userId = ? ORDER BY created_at DESC;',
        [userId]
      );
      // console.log(`✅ Found ${danksagungen?.length || 0} danksagungen for user ${userId}`);
      return danksagungen || [];
    } catch (error) {
      console.error('❌ Error fetching danksagungen for user:', error);
      return [];
    }
  }

  async function addDanksagungen(location: Location) {
    const arr = await fetchDanksagungen(location);
    // console.log('Fetched danksagungen:', arr);

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
              d.location || '', // Handle null location values
              d.authorId,
              d.long,
              d.lat,
              d.profileImageUrl,
            ]
          );
        }
      });
      // console.log('✅ Danksagungen in SQLite gespeichert');
    } catch (error) {
      console.error('❌ Error storing fetched danksagungen:', error);
      throw error;
    }
  }

  return { getDanksagungen, getDanksagungenForUser, addDanksagungen };
}