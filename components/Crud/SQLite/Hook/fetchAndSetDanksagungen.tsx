import { useState } from 'react';
import { useDanksagungStore } from '@/components/stores/danksagungStores';
import { Location } from '@/components/stores/locationStore';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useLastFetchedAtStore } from '@/components/stores/lastFetchedAt';
import React from 'react';
import { useDanksagungenService } from '../Services/danksagungenService';

export function useFetchDanksagungen(location: Location | null, userId: string) {
  const { setDanksagungen, setLoading } = useDanksagungStore();
  const { lastFetchedAt, setLastFetchedAt } = useLastFetchedAtStore();
  const [error, setError] = useState<string | null>(null);

  // Hook-Aufruf jetzt hier im Custom Hook
  const { addDanksagungen, getDanksagungenForUser } = useDanksagungenService();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (!location) {
          router.push('/locationPermission');
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const now = Date.now();
          const THIRTY_MINUTES = 30 * 60 * 1000;
          const needsRefresh = !lastFetchedAt || (now - lastFetchedAt > THIRTY_MINUTES);

          // Wenn ein Refresh nötig ist, hole neue Daten von extern und speichere sie in der DB
          if (needsRefresh) {
            await addDanksagungen(location);
            setLastFetchedAt(now);
          }

          // Danach immer aktuelle Daten aus der lokalen DB holen
          const danksagungen = await getDanksagungenForUser(userId);
          setDanksagungen(danksagungen);
        } catch (e: any) {
          console.error('Error fetching danksagungen:', e);
          setError(e?.message || 'An unknown error occurred.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  return { error };
}