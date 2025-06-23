import { supabase } from '@/components/config/supabase';
import { Post } from '@/components/types/post';
 
import { getBoundingBox } from '@/components/Location/boundingBox';
import { Location } from '@/components/types/location';

export const fetchPosts = async (location: Location | null): Promise<Post[]> => {
  try {
    console.log('Starting post fetch with location:', location);
    
    if (!location) {
      console.error('Location is null or undefined');
      throw new Error('Benutzerstandort ist nicht verfügbar');
    }

    const { latitude, longitude } = location;
    const radiusInKm = 10;
    const { minLat, maxLat, minLon, maxLon } = getBoundingBox(latitude, longitude, radiusInKm);
    
    console.log('Fetching posts with bounds:', { minLat, maxLat, minLon, maxLon });

    // Fetch posts
    const { data: posts, error: postsError } = await supabase
      .from('Posts')
      .select('*')
      .gte('lat', minLat)
      .lte('lat', maxLat)
      .gte('long', minLon)
      .lte('long', maxLon)
      .order('created_at', { ascending: false })
      .limit(100);

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      throw postsError;
    }

    console.log(`Successfully fetched ${posts?.length || 0} posts`);

    if (!posts || posts.length === 0) {
      console.log('No posts found in the specified area');
      return [];
    }

    // Fetch user categories
    const userIds = [...new Set(posts.map(post => post.userId))];
    console.log('Fetching categories for users:', userIds);

    const { data: users, error: usersError } = await supabase
      .from('Users')
      .select('id, kategorien')
      .in('id', userIds);

    if (usersError) {
      console.error('Error fetching user categories:', usersError);
      throw usersError;
    }

    console.log(`Successfully fetched categories for ${users?.length || 0} users`);

    // Create a map of user categories
    const userCategories = new Map(users.map(user => [user.id, user.kategorien || []]));

    // Combine posts with user categories
    const postsWithCategories = posts.map(post => ({
      ...post,
      kategorien: userCategories.get(post.userId) || []
    }));

    console.log('Successfully combined posts with user categories');
    return postsWithCategories as Post[];
  } catch (error) {
    console.error("Detailed error in fetchPosts:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
