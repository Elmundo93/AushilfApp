// services/Storage/Syncs/DanksagungsService.ts
import { useSQLiteContext } from 'expo-sqlite';
import { fetchDanksagungen } from '@/components/Crud/Danksagungen/fetchDanksagung';
import { Danksagung }        from '@/components/types/Danksagungen';
import { Location }          from '@/components/types/location';

export function useDanksagungenService() {
  const db = useSQLiteContext();

  async function getDanksagungen() {
    return db.getAllAsync<Danksagung>('SELECT * FROM danksagungen_fetched');
  }

  async function addDanksagungen(location: Location) {
    const arr = await fetchDanksagungen(location);
    console.log('Fetched danksagungen:', arr);

    try {
      // Alte Danksagungen löschen
      await db.execAsync('DELETE FROM danksagungen_fetched;');

      // In der Reihenfolge genau wie im CREATE TABLE
      for (const d of arr) {
        await db.runAsync(
          `INSERT OR REPLACE INTO danksagungen_fetched (
            id,
            created_at,
            vorname,
            nachname,
            writtenText,
            userId,
            location,
            authorId,
            long,
            lat,
            profileImageUrl
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            d.id,               // INTEGER
            d.created_at,       // TEXT
            d.vorname,          // TEXT
            d.nachname,         // TEXT
            d.writtenText,      // TEXT
            d.userId,           // TEXT
            d.location,         // TEXT
            d.authorId,         // TEXT → passt auf authorID
            d.long,             // REAL
            d.lat,              // REAL
            d.profileImageUrl,  // TEXT
          ]
        );
      }

      console.log('✅ Danksagungen in SQLite gespeichert');
    } catch (error) {
      console.error('❌ Error storing fetched danksagungen:', error);
      throw error;
    }
  }

  return { getDanksagungen, addDanksagungen };
}