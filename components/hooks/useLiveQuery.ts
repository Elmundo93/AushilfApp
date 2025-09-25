// hooks/useLiveQuery.ts
import { useEffect, useState } from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';
import { liveBus } from '@/components/lib/liveBus';

export function useLiveQuery<T>(
  db: SQLiteDatabase,
  sql: string,
  params: any[] = [],
  subscribeTopics: string[] = []
) {
  const [rows, setRows] = useState<T[]>([]);

  async function run() {
    const res = await db.getAllAsync<T>(sql, params);
    setRows(res ?? []);
  }

  useEffect(() => {
    run();
    const unsub = subscribeTopics.map(t => liveBus.subscribe(t, run));
    return () => { unsub.forEach(u => u()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, sql, JSON.stringify(params), subscribeTopics.join('|')]);

  return rows;
}