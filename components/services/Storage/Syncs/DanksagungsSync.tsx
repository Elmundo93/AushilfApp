// services/Storage/Syncs/useDanksagungSync.ts
import NetInfo from '@react-native-community/netinfo';
import { useDanksagungenService } from '@/components/Crud/SQLite/Services/danksagungenService';
import { useDanksagungStore }    from '@/components/stores/danksagungStores';
import { Location }               from '@/components/types/location';

/**
 * Custom Hook, der intern Hooks aufruft und eine reine Funktion zurückgibt,
 * die du überall verwenden kannst, ohne gegen die Rules of Hooks zu verstoßen.
 */
export function useDanksagungSync() {
  const { addDanksagungen, getDanksagungen } = useDanksagungenService();
  const setDanksagungen = useDanksagungStore((s) => s.setDanksagungen);
  const setLoading      = useDanksagungStore((s) => s.setLoading);

  return async function syncDanksagungen(location: Location) {
    try {
      setLoading(true);

      const net = await NetInfo.fetch();
      if (net.isConnected && net.isInternetReachable) {
        // Supabase → SQLite
        await addDanksagungen(location);
      }

      // SQLite → Zustand
      const all = await getDanksagungen();
      setDanksagungen(all);
      console.log('✅ Danksagungen erfolgreich synchronisiert');
    } catch (e: any) {
      console.error('❌ Fehler beim Danksagungen-Sync:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  };
}