import { useSQLiteContext } from 'expo-sqlite';
import { fetchPosts } from '@/components/Crud/Post/FetchPost';
import { Post } from '@/components/types/post';
import { Location } from '@/components/stores/locationStore';


export function usePostService() {
  const db = useSQLiteContext();

  async function getPosts() {
    return await db.getAllAsync<Post>('SELECT * FROM posts');
  }

  async function addPosts(location: Location) {
    try {
      const posts = await fetchPosts(location as Location);
  
      await db.execAsync('BEGIN TRANSACTION;');
  
      await db.execAsync('DELETE FROM Posts;');
  
      for (const post of posts) {
        await db.runAsync(
          `INSERT OR REPLACE INTO Posts (
            id, created_at, location, nachname, vorname, option, category, profileImageUrl, long, lat, userBio, userId
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            post.id,
            post.created_at,
            post.location,
            post.nachname,
            post.vorname,
            post.option,
            post.category,
            post.profileImageUrl,
            post.long,
            post.lat,
            post.userBio,
            post.userId
          ]
        );
      }
  
      await db.execAsync('COMMIT;');
  
      console.log('Alle Posts wurden erfolgreich in SQLite gespeichert.');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      console.error('Fehler beim Speichern der Posts in SQLite:', error);
    }
  };

  return { getPosts, addPosts };
}
