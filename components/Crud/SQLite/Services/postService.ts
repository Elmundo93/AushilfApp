// components/Crud/SQLite/Services/postService.ts
import { useSQLiteContext } from 'expo-sqlite';
import { fetchPosts } from '@/components/Crud/Post/FetchPost';
import { Post } from '@/components/types/post';
import { Location } from '@/components/types/location';

export function usePostService() {
  const db = useSQLiteContext();

  async function getPosts(): Promise<Post[]> {
    return db.getAllAsync<Post>('SELECT * FROM posts_fetched;');
  }

  async function addPosts(location: Location) {
    const posts = await fetchPosts(location);
    console.log('Fetched posts:', posts);

    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM posts_fetched;', []);
        for (const p of posts) {
          await db.runAsync(
            `INSERT OR REPLACE INTO posts_fetched (
               id, created_at, location, nachname, vorname,
               option, category, profileImageUrl, long, lat,
               userBio, userId, postText
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              p.id,
              p.created_at,
              p.location,
              p.nachname,
              p.vorname,
              p.option,
              p.category,
              p.profileImageUrl,
              p.long,
              p.lat,
              p.userBio ?? '',
              p.userId,
              p.postText,
            ]
          );
        }
      });
      console.log('✅ Posts in SQLite gespeichert');
    } catch (error) {
      console.error('❌ Error storing posts in posts_fetched table:', error);
      throw error;
    }
  }

  return { getPosts, addPosts };
}