import { useEffect, useState } from 'react';
import { usePostService } from '@/components/Crud/SQLite/Services/postService';
import { usePostStore } from '@/components/stores/postStore';
import { Location } from '@/components/stores/locationStore';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useLastFetchedAtStore } from '@/components/stores/lastFetchedAt';
import React from 'react';
import { usePostCountStore } from '@/components/stores/postCountStores';
export function useFetchPosts(location: Location | null) {
  const { addPosts, getPosts } = usePostService();
  const { setPosts, setLoading } = usePostStore();
  const { lastFetchedAt, setLastFetchedAt } = useLastFetchedAtStore();
  const { postCount } = usePostCountStore();
  const [error, setError] = useState<string | null>(null);

  const THIRTY_MINUTES = 30 * 60 * 1000;


  useFocusEffect(
    React.useCallback(() => {
      const now = Date.now(); // Move this inside
    
       
    
  
      const fetchAndStorePosts = async () => {
        if (!lastFetchedAt || (now - lastFetchedAt) > THIRTY_MINUTES) {
          setLoading(true);
          setError(null);
  
          try {
            if (location) {
              await addPosts(location);
            }
            const posts = await getPosts();
            setPosts(posts);
            setLastFetchedAt(now);
          } catch (e: any) {
            console.error('Error fetching posts:', e);
            setError(e?.message || 'An unknown error occurred.');
          } finally {
            setLoading(false);
          }
        }
      };
  
      fetchAndStorePosts();
    }, [location, lastFetchedAt, setLoading, setPosts, setLastFetchedAt, postCount])
  
  );

  useEffect(() => {
    if (postCount > 0 && location) {
      const fetchNewPosts = async () => {
        setLoading(true);
        setError(null);

        try {
          await addPosts(location);
          const posts = await getPosts();
          setPosts(posts);
        } catch (e: any) {
          console.error('Error fetching posts:', e);
          setError(e?.message || 'An unknown error occurred.');
        } finally {
          setLoading(false);
        }
      };

      fetchNewPosts();
    }
  }, [postCount]);

  return { error };
}