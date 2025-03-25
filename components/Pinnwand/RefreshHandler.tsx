import React, { forwardRef, LegacyRef as Ref, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { usePostStore } from '@/components/stores/postStore'; 
import { useLastFetchedAtStore } from '@/components/stores/lastFetchedAt';
import { usePostService } from '@/components/Crud/SQLite/Services/postService';
import { Location } from '@/components/stores/locationStore';

const THIRTY_MINUTES = 30 * 60 * 1000;

const RefreshHandler = forwardRef(({ location }: { location: Location | null }, ref) => {
  const { loading, setLoading, setPosts } = usePostStore();
  const { 
    lastFetchedAtDragHandler, 
    refreshCount, 
    setRefreshCount, 
    setLastFetchedAtDragHandler 
  } = useLastFetchedAtStore();
  const { addPosts, getPosts } = usePostService();

  const refreshPosts = useCallback(async () => {
    if (!location) return;

    const now = Date.now();
    const withinWindow = lastFetchedAtDragHandler && (now - lastFetchedAtDragHandler < THIRTY_MINUTES);

    // If we're outside the half-hour window or no window started yet, start a new one.
    if (!withinWindow) {
      // Reset counts and establish a new half-hour window
      setRefreshCount(0);
      setLastFetchedAtDragHandler(now);
    }

    // Now we are guaranteed to be in a window. Check how many refreshes we have left.
    if (refreshCount >= 5) {
      // User reached the limit in this half-hour window
      console.log('Refresh limit reached. Please wait until the half-hour window resets.');
      return;
    }

    // Proceed with the refresh
    setLoading(true);
    try {
      await addPosts(location);
      const newPosts = await getPosts();
      setPosts(newPosts);

      // Increment the refresh count since we successfully refreshed
      setRefreshCount(refreshCount + 1);
      
      // Note: We do NOT reset lastFetchedAtDragHandler here. It remains the start of this window.
      
    } catch (error) {
      console.error('Error during manual refresh:', error);
    } finally {
      setLoading(false);
    }
  }, [location, lastFetchedAtDragHandler, refreshCount, setRefreshCount, setLastFetchedAtDragHandler, setPosts, setLoading, addPosts, getPosts]);

  const onRefresh = async () => {
    await refreshPosts();
  };

  return (
    <RefreshControl
      ref={ref as Ref<RefreshControl>}
      refreshing={loading}
      onRefresh={onRefresh}
      title="Pinnwand aktualisieren"
    />
  );
});

export default RefreshHandler;