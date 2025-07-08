// components/Crud/SQLite/Services/SQLiteService.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { dbConnectionManager } from './dbMutex';

export class SQLiteService {
  private static instance: SQLiteService;

  static getInstance(): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService();
    }
    return SQLiteService.instance;
  }

  /**
   * Führt eine SQLite-Operation mit der globalen Verbindung aus
   */
  async runOperation<T>(operation: (db: SQLiteDatabase) => Promise<T>): Promise<T> {
    const db = dbConnectionManager.getGlobalDb();
    if (!db) {
      throw new Error('Global SQLite database not available');
    }

    return dbConnectionManager.runExclusive(async () => {
      return await operation(db);
    });
  }

  /**
   * Führt eine SQLite-Transaktion aus
   */
  async runTransaction<T>(operation: (db: SQLiteDatabase) => Promise<T>): Promise<T> {
    return this.runOperation(async (db) => {
      return await db.withTransactionAsync(async () => {
        return await operation(db);
      });
    });
  }

  /**
   * Führt eine SQLite-Exclusive-Transaktion aus
   */
  async runExclusiveTransaction<T>(operation: (db: SQLiteDatabase) => Promise<T>): Promise<T> {
    return this.runOperation(async (db) => {
      return await db.withExclusiveTransactionAsync(async () => {
        return await operation(db);
      });
    });
  }

  /**
   * Führt eine SQLite-Abfrage aus
   */
  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    return this.runOperation(async (db) => {
      return await db.getAllAsync<T>(sql, params);
    });
  }

  /**
   * Führt eine SQLite-Abfrage für eine einzelne Zeile aus
   */
  async queryFirst<T>(sql: string, params: any[] = []): Promise<T | null> {
    return this.runOperation(async (db) => {
      return await db.getFirstAsync<T>(sql, params);
    });
  }

  /**
   * Führt eine SQLite-INSERT/UPDATE/DELETE-Operation aus
   */
  async execute(sql: string, params: any[] = []): Promise<void> {
    return this.runOperation(async (db) => {
      await db.runAsync(sql, params);
    });
  }

  /**
   * Führt eine SQLite-Transaktion mit mehreren Operationen aus
   */
  async executeBatch(operations: Array<{ sql: string; params: any[] }>): Promise<void> {
    return this.runTransaction(async (db) => {
      for (const op of operations) {
        await db.runAsync(op.sql, op.params);
      }
    });
  }
} 