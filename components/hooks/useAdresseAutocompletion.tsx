import { useState, useCallback } from 'react';
import axios from 'axios';

export function useAdresseAutocompletion() {
  const [results, setResults] = useState([]);

  const search = useCallback(async (query: string) => {
    if (query.length < 3) return;
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          countrycodes: 'de',
          format: 'json',
          addressdetails: 1,
          limit: 5,
        },
      });
      setResults(res.data);
    } catch (err) {
      console.error('Adresse Autocomplete Fehler', err);
    }
  }, []);

  return { results, search };
}