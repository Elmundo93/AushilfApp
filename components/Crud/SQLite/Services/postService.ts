// components/Crud/SQLite/Services/postService.ts
import { useSQLiteContext } from 'expo-sqlite';
import { fetchPosts } from '@/components/Crud/Post/FetchPost';
import { Post } from '@/components/types/post';
import { Location } from '@/components/types/location';
import { dbMutex } from './dbMutex';

export function usePostService() {
  const db = useSQLiteContext();

  async function getPosts(): Promise<Post[]> {
    try {
      const posts = await db.getAllAsync<Post>(`
        SELECT 
          id, created_at, location, nachname, option, postText, userId, profileImageUrl, long, lat, vorname, userBio, category, kategorien
        FROM posts_fetched
        ORDER BY created_at DESC
      `);

      return posts.map(post => ({
        ...post,
        kategorien: typeof post.kategorien === 'string' ? JSON.parse(post.kategorien) : []
      }));
    } catch (error) {
      console.error('Error getting posts from SQLite:', error);
      throw error;
    }
  }

  async function addPosts(location: Location) {
    try {
      console.log('Starting post synchronization...');
      const posts = await fetchPosts(location);
      console.log(`Fetched ${posts.length} posts from Supabase`);

      if (posts.length === 0) {
        console.log('No posts to sync');
        return;
      }

      await dbMutex.runExclusive(async () => {
        await db.withTransactionAsync(async () => {
          // Clear existing posts
          await db.runAsync('DELETE FROM posts_fetched;', []);
          console.log('Cleared existing posts from SQLite');

          // Insert new posts
          for (const p of posts) {
            await db.runAsync(
              `INSERT OR REPLACE INTO posts_fetched (
                id, created_at, location, nachname, option, postText, userId, profileImageUrl, long, lat, vorname, userBio, category, kategorien
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                p.id,
                p.created_at,
                p.location,
                p.nachname,
                p.option,
                p.postText,
                p.userId,
                p.profileImageUrl,
                p.long,
                p.lat,
                p.vorname,
                p.userBio,
                p.category,
                JSON.stringify(p.kategorien || [])
              ]
            );
          }
          console.log('Successfully inserted posts into SQLite');
        });
      });

      console.log('✅ Posts successfully synchronized');
    } catch (error) {
      console.error('❌ Error in post synchronization:', error);
      throw error;
    }
  }

  return { getPosts, addPosts };
}