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
import { Location }            from '@/components/types/location';

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

export const DataProvider = ({ children }: PropsWithChildren) => {
  const { location } = useLocationStore();
  const { postCount } = usePostCountStore();
  const syncPosts        = usePostSync();
  const syncDanksagungen = useDanksagungSync();

  const [loading, setLoading]     = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncAll = async () => {
    if (!location) return;
    setLoading(true);
    setSyncError(null);

    try {
      // Posts und Danksagungen parallel synchronisieren
      await Promise.all([
        syncPosts(location),
        syncDanksagungen(location),
      ]);
    } catch (e: any) {
      console.error('❌ Fehler beim gesamten Sync:', e);
      setSyncError(e.message || 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      syncAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-depsb
  }, [location]);

  useEffect(() => {
    if (location && postCount) {
      syncPosts(location);
    }

  }, [postCount]);
  

  return (
    <DataContext.Provider value={{ syncAll, loading, syncError }}>
      {children}
    </DataContext.Provider>
  );
};