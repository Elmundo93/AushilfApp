// components/provider/DataProvider.tsx
import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import { useLocationStore }    from '@/components/stores/locationStore';
import { usePostSync }         from '@/components/services/Storage/Syncs/PostSync';
import { useDanksagungSync }   from '@/components/services/Storage/Syncs/DanksagungsSync';
import { usePostCountStore }   from '@/components/stores/postCountStores';
import { syncChannelsOnce }    from '@/components/services/Chat/chatSync';
import { subscribeChannels }   from '@/components/services/Chat/chatRealtime';
import { useAuthStore }        from '@/components/stores/AuthStore';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

type DataContextType = { syncAll: () => Promise<void>; loading: boolean; syncError: string | null; };
const DataContext = createContext<DataContextType>({ syncAll: async () => {}, loading: false, syncError: null });
export const useDataContext = () => useContext(DataContext);

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const DataProvider = ({ children }: PropsWithChildren) => {
  const { location } = useLocationStore();
  const { postCount } = usePostCountStore();
  const { user } = useAuthStore();
  const syncPosts        = usePostSync();
  const syncDanksagungen = useDanksagungSync();

  const [loading, setLoading]     = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  const checkNetworkConnection = async () => {
    const net = await NetInfo.fetch();
    return !!(net.isConnected && net.isInternetReachable);
  };

  const syncWithRetry = async (syncFn: () => Promise<any>, name: string, isOnboarding = false) => {
    let retries = 0;
    for (;;) {
      try {
        if (!(await checkNetworkConnection())) throw new Error('Keine Internetverbindung');
        await syncFn();
        return;
      } catch (e: any) {
        retries++;
        // Legacy-Onboarding-Skip (falls noch relevant)
        if (isOnboarding && e?.message?.includes('Both secret and user tokens are not set')) return;
        if (retries >= MAX_RETRIES) throw e;
        await sleep(RETRY_DELAY * retries);
      }
    }
  };

  const syncAll = async () => {
    if (!location) return;
    const isInOnboarding = !!(user && !user.onboarding_completed);
    setLoading(true);
    setSyncError(null);
    try {
      await syncWithRetry(() => syncPosts(location), 'Posts', isInOnboarding);
      await syncWithRetry(() => syncDanksagungen(location), 'Danksagungen', isInOnboarding);
      await syncWithRetry(() => syncChannelsOnce(), 'Channels', isInOnboarding);
    } catch (e: any) {
      setSyncError(e?.message || 'Unbekannter Fehler');
      if (!isInOnboarding) {
        Alert.alert(
          'Synchronisationsfehler',
          'Die Daten konnten nicht synchronisiert werden. Bitte überprüfe deine Internetverbindung und versuche es später erneut.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Einmalig: Channel-Realtime abonnieren (Server → SQLite spiegeln)
  useEffect(() => {
    const unsub = subscribeChannels();   // lebt im gesamten Auth-Lebenszyklus
    return () => { try { unsub?.(); } catch {} };
  }, []);

  // 🔹 Bei Location-Änderung Vollsync
  useEffect(() => { if (location) syncAll(); }, [location]);

  // 🔹 Posts nach Creation aktualisieren
  useEffect(() => {
    if (location && postCount) {
      const isInOnboarding = !!(user && !user.onboarding_completed);
      syncWithRetry(() => syncPosts(location), 'Posts', isInOnboarding).catch(() => {});
    }
  }, [postCount, location, user]);

  // 🔹 Online wieder da? → sanfter Resync aller Daten
  useEffect(() => {
    const unsubNet = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        syncAll().catch(() => {});
      }
    });
    return () => unsubNet();
  }, [location]);

  return (
    <DataContext.Provider value={{ syncAll, loading, syncError }}>
      {children}
    </DataContext.Provider>
  );
};