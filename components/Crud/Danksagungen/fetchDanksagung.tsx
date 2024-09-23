import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Danksagung } from '../../types/Danksagungen';
import { UseFetchDanksagungenResult } from '../../types/Danksagungen';
import { useDanksagungStore } from '../../stores/danksagungStores';



export const useFetchDanksagungen = (userId: string): UseFetchDanksagungenResult => {
    const [danksagungen, setDanksagungen] = useState<Danksagung[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const danksagungCount = useDanksagungStore(state => state.danksagungCount);

  const fetchDanksagungen = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('Danksagungen')
        .select('*')
        .eq('userId', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDanksagungen(data || []);
    } catch (err) {
      setError('Fehler beim Laden der Danksagungen: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanksagungen();
  }, [userId, danksagungCount]);

  return { danksagungen, loading, error, refetch: fetchDanksagungen };
};