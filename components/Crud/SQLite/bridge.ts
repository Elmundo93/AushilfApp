// sqlite/bridge.ts
import type { SQLiteDatabase } from 'expo-sqlite';

let _db: SQLiteDatabase | null = null;

export function setDB(db: SQLiteDatabase) {
  _db = db;
}

export function getDB(): SQLiteDatabase {
  if (!_db) throw new Error('DB not set. Call setDB() in your provider before using services.');
  return _db;
}