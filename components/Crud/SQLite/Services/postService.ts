import { useSQLiteContext } from 'expo-sqlite';
import { fetchPosts } from '@/components/Crud/Post/FetchPost';
import { Post } from '@/components/types/post';
import { Location } from '@/components/stores/locationStore';


export function usePostService() {
  const db = useSQLiteContext();

  async function getPosts() {
    const posts = await db.getAllAsync<Post>('SELECT * FROM posts_fetched');
    console.log('getPosts', posts)
    return posts
  }

  async function addPosts(location: Location) {
    try {
      const posts = await fetchPosts(location);
      console.log('posts', posts)
  
      await db.execAsync('BEGIN TRANSACTION;');
  

      await db.execAsync('DELETE FROM posts_fetched;');
  
      for (const post of posts) {
        await db.runAsync(
          `INSERT INTO posts_fetched (
              id, created_at, location, nachname, vorname, option, category, profileImageUrl, long, lat, userBio, userId, postText
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
            post.userBio,
            post.userId,
            post.postText,
          ]
          
        );
        console.log('post', post) 
      }
  
      await db.execAsync('COMMIT;');
      console.log('Fetched posts successfully stored in posts_fetched table.');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      console.error('Error storing fetched posts in posts_fetched table:', error);
    }
  }
  

  return {
    getPosts,
    addPosts,
  };
}
