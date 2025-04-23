import React, { forwardRef, LegacyRef as Ref, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { usePostStore } from '@/components/stores/postStore'; 
import { useLastFetchedAtStore } from '@/components/stores/lastFetchedAt';
import { useDataContext } from '@/components/provider/DataProvider';
import { Location } from '@/components/types/location'; // if not already imported

const THIRTY_MINUTES = 30 * 60 * 1000;

const RefreshHandler = forwardRef(({ location }: { location: Location | null }, ref) => {
  const { loading, setLoading } = usePostStore(); // Keep using Zustand loading
  const { 
    lastFetchedAtDragHandler, 
    refreshCount, 
    setRefreshCount, 
    setLastFetchedAtDragHandler 
  } = useLastFetchedAtStore();
  const { syncAll } = useDataContext();

  const refreshPosts = useCallback(async () => {
    if (!location) return;

    const now = Date.now();
    const withinWindow = lastFetchedAtDragHandler && (now - lastFetchedAtDragHandler < THIRTY_MINUTES);

    if (!withinWindow) {
      setRefreshCount(0);
      setLastFetchedAtDragHandler(now);
    }

    if (refreshCount >= 5) {
      console.log('Refresh limit reached. Please wait until the half-hour window resets.');
      return;
    }

    setLoading(true);
    try {
      await syncAll(); // Central sync replaces addPosts + getPosts
      setRefreshCount(refreshCount + 1);
    } catch (error) {
      console.error('Error during manual refresh:', error);
    } finally {
      setLoading(false);
    }
  }, [
    location, 
    lastFetchedAtDragHandler, 
    refreshCount, 
    setRefreshCount, 
    setLastFetchedAtDragHandler, 
    setLoading, 
    syncAll
  ]);

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