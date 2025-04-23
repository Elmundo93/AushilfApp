import { useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useAuthStore } from '@/components/stores/AuthStore';
import { syncFromSupabase, pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';
import { loadUserInfo } from '@/components/Crud/SQLite/Services/UserInfoService';

export const usePreloadUserInfo = () => {
  const db = useSQLiteContext();
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    const preload = async () => {
      const userId = user?.id;
      if (!userId) return;

      try {
        await syncFromSupabase(db, userId);
        const localUser = await loadUserInfo(db);
        if (localUser) setUser(localUser);
      } catch (err) {
        console.error('Fehler beim Vorladen der Benutzerdaten:', err);
      }
    };

    preload();
  }, [user?.id]);
};