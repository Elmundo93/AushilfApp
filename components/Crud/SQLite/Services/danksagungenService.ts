import { useSQLiteContext } from 'expo-sqlite';
import { fetchDanksagungen } from '@/components/Crud/Danksagungen/fetchDanksagung';
import { Danksagung } from '@/components/types/Danksagungen';
import { Location } from '@/components/stores/locationStore';


export function useDanksagungenService() {
  const db = useSQLiteContext();

    async function getDanksagungen() {
    const danksagungen = await db.getAllAsync<Danksagung>('SELECT * FROM danksagungen_fetched');
    console.log('getDanksagungen', danksagungen)
    return danksagungen
  }

  async function getDanksagungenForUser(userId: string) {
    return await db.getAllAsync<Danksagung>('SELECT * FROM danksagungen_fetched WHERE userId = ?', [userId]);
  }

  async function addDanksagungen(location: Location) {
    try {
      const danksagungen = await fetchDanksagungen(location);
      console.log('danksagungen', danksagungen)
  
      await db.execAsync('BEGIN TRANSACTION;');
  

      await db.execAsync('DELETE FROM danksagungen_fetched;');
  
      for (const danksagung of danksagungen) {
        await db.runAsync(
          `INSERT INTO danksagungen_fetched (
                id, created_at, location, nachname, vorname, profileImageUrl, long, lat, userId, writtenText, authorId
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            danksagung.id,
            danksagung.created_at,
            danksagung.location,
            danksagung.nachname,
            danksagung.vorname,
            danksagung.profileImageUrl,
            danksagung.long,
            danksagung.lat,
            danksagung.userId,
            danksagung.writtenText,
            danksagung.authorId,

          ]
          
        );
        console.log('danksagung', danksagung) 
      }
  
      await db.execAsync('COMMIT;');
      console.log('Fetched danksagungen successfully stored in danksagungen_fetched table.');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      console.error('Error storing fetched danksagungen in danksagungen_fetched table:', error);
    }
  }
  

  return {
    getDanksagungen,
    addDanksagungen,
    getDanksagungenForUser,
  };
}