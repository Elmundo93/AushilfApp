// components/provider/DataProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import { useLocationStore }    from '@/components/stores/locationStore';
import { usePostSync }         from '@/components/services/Storage/Syncs/PostSync';
import { useDanksagungSync }   from '@/components/services/Storage/Syncs/DanksagungsSync';
import { usePostCountStore }   from '@/components/stores/postCountStores';
import { syncChannelsOnce }      from '@/components/services/Chat/chatSync';

import { useAuthStore }        from '@/components/stores/AuthStore';

import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

type DataContextType = {
  syncAll: () => Promise<void>;
  loading: boolean;
  syncError: string | null;
};

const DataContext = createContext<DataContextType>({
  syncAll: async () => {},
  loading: false,
  syncError: null,
});
export const useDataContext = () => useContext(DataContext);

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // Increased to 2 seconds

export const DataProvider = ({ children }: PropsWithChildren) => {
  const { location } = useLocationStore();
  const { postCount } = usePostCountStore();
  const { user } = useAuthStore();
  const syncPosts        = usePostSync();
  const syncDanksagungen = useDanksagungSync();
  const syncChannel = syncChannelsOnce;

  const [loading, setLoading]     = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const checkNetworkConnection = async () => {
    const net = await NetInfo.fetch();
    console.log('Network status:', {
      isConnected: net.isConnected,
      isInternetReachable: net.isInternetReachable,
      type: net.type
    });
    return net.isConnected && net.isInternetReachable;
  };

  const syncWithRetry = async (syncFn: () => Promise<any>, name: string, isOnboarding = false) => {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        console.log(`Attempting ${name} sync, attempt ${retries + 1}/${MAX_RETRIES}`);
        
        const isConnected = await checkNetworkConnection();
        if (!isConnected) {
          throw new Error('Keine Internetverbindung');
        }

        await syncFn();
        console.log(`✅ ${name} sync successful`);
        return;
      } catch (e: any) {
        retries++;
        console.error(`Error in ${name} sync:`, {
          attempt: retries,
          error: e,
          message: e.message,
          stack: e.stack
        });

        // Handle specific StreamChat initialization errors during onboarding
        if (isOnboarding && e.message && e.message.includes('Both secret and user tokens are not set')) {
          console.log(`ℹ️ ${name} sync skipped during onboarding - this is expected`);
          return; // Don't retry, just return gracefully
        }

        if (retries === MAX_RETRIES) {
          console.error(`❌ ${name} sync failed after ${MAX_RETRIES} attempts`);
          throw e;
        }

        const delay = RETRY_DELAY * retries;
        console.log(`⚠️ ${name} sync failed, retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  };

  const syncAll = async () => {
    if (!location) {
      console.log('No location available for sync');
      return;
    }

    // Check if user is in onboarding
    const isInOnboarding = user && !user.onboarding_completed;

    console.log('Starting full sync with location:', location);
    console.log('Onboarding status:', isInOnboarding ? 'In progress' : 'Completed');
    setLoading(true);
    setSyncError(null);

    try {
      // Synchronize sequentially with retry logic
      await syncWithRetry(() => syncPosts(location), 'Posts', isInOnboarding || false);
      await syncWithRetry(() => syncDanksagungen(location), 'Danksagungen', isInOnboarding || false);
      await syncWithRetry(() => syncChannel(), 'Channels', isInOnboarding || false);
      console.log('✅ All syncs completed successfully');
    } catch (e: any) {
      console.error('❌ Full sync failed:', {
        error: e,
        message: e.message,
        stack: e.stack
      });
      setSyncError(e.message || 'Unbekannter Fehler');
      
      // Only show error alert if user is not in onboarding
      if (!isInOnboarding) {
        Alert.alert(
          'Synchronisationsfehler',
          'Die Daten konnten nicht synchronisiert werden. Bitte überprüfe deine Internetverbindung und versuche es später erneut.'
        );
      } else {
        console.log('ℹ️ Skipping error alert during onboarding');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      console.log('Location changed, triggering sync');
      syncAll();
    }
  }, [location]);

  useEffect(() => {
    if (location && postCount) {
      console.log('Post count changed, triggering post sync');
      const isInOnboarding = user && !user.onboarding_completed;
      syncWithRetry(() => syncPosts(location), 'Posts', isInOnboarding || false).catch(e => {
        console.error('Post sync after creation failed:', {
          error: e,
          message: e.message,
          stack: e.stack
        });
      });
    }
  }, [postCount]);

  return (
    <DataContext.Provider value={{ syncAll, loading, syncError }}>
      {children}
    </DataContext.Provider>
  );
};