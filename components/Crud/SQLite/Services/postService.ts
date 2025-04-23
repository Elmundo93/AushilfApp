// components/Crud/SQLite/Services/postService.ts
import { useSQLiteContext } from 'expo-sqlite';
import { fetchPosts }        from '@/components/Crud/Post/FetchPost';
import { Post }              from '@/components/types/post';
import { Location }          from '@/components/types/location';

export function usePostService() {
  const db = useSQLiteContext();

  async function getPosts() {
    const posts = await db.getAllAsync<Post>('SELECT * FROM posts_fetched');
    console.log('getPosts', posts);
    return posts;
  }

  async function addPosts(location: Location) {
    const posts = await fetchPosts(location);
    console.log('Fetched posts:', posts);

    try {
      // Alte Posts löschen
      await db.execAsync('DELETE FROM posts_fetched;');
      // Neue Posts einfügen (OR REPLACE vermeidet UNIQUE-Fehler)
      for (const post of posts) {
        await db.runAsync(
          `INSERT OR REPLACE INTO posts_fetched (
             id, created_at, location, nachname, vorname,
             option, category, profileImageUrl, long, lat,
             userBio, userId, postText
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
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
            post.userBio ?? '',
            post.userId,
            post.postText,
          ]
        );
      }
      console.log('Posts in SQLite gespeichert');
    } catch (error) {
      console.error('Error storing posts in posts_fetched table:', error);
      throw error;
    }
  }

  return { getPosts, addPosts };
}