// components/services/Chat/utils.ts
import type { SQLiteDatabase } from 'expo-sqlite';

export const nowUnix = () => Math.floor(Date.now() / 1000);

export const jsonStr = (v: any) => {
  try { return JSON.stringify(v ?? {}); } catch { return '{}'; }
};

export async function runInTx<T>(db: SQLiteDatabase, fn: () => Promise<T>): Promise<T> {
  await db.execAsync('BEGIN IMMEDIATE TRANSACTION;');
  try {
    const res = await fn();
    await db.execAsync('COMMIT;');
    return res;
  } catch (e) {
    await db.execAsync('ROLLBACK;');
    throw e;
  }
}