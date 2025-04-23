// services/Storage/Syncs/usePostSync.ts
import NetInfo from '@react-native-community/netinfo';
import { usePostService } from '@/components/Crud/SQLite/Services/postService';
import { usePostStore }   from '@/components/stores/postStore';
import { Location }       from '@/components/types/location';

/**
 * Custom Hook, der intern nur in React‐Kontext Hooks aufruft,
 * und eine reine Funktion zurückgibt, die du frei überall einsetzen kannst.
 */
export function usePostSync() {
  const { addPosts, getPosts } = usePostService();               // Hook
  const setPosts   = usePostStore((s) => s.setPosts);            // Hook
  const setLoading = usePostStore((s) => s.setLoading);          // Hook

  return async function syncPosts(location: Location) {
    try {
      setLoading(true);

      const net = await NetInfo.fetch();
      if (net.isConnected && net.isInternetReachable) {
        await addPosts(location);   // Supabase → SQLite
      }

      const posts = await getPosts();  // SQLite → Zustand
      setPosts(posts);
      console.log('✅ Posts erfolgreich synchronisiert');
    } catch (e: any) {
      console.error('❌ Fehler beim Posts-Sync:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  };
}