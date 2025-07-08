import { Mutex } from 'async-mutex';

// Enhanced database mutex with connection management
export const dbMutex = new Mutex();

// Database connection state tracking
let isDbInitialized = false;
let dbConnectionCount = 0;

export const dbConnectionManager = {
  incrementConnection: () => {
    dbConnectionCount++;
    console.log(`🔗 DB Connection count: ${dbConnectionCount}`);
    return true;
  },
  
  decrementConnection: () => {
    dbConnectionCount = Math.max(0, dbConnectionCount - 1);
    console.log(`🔗 DB Connection count: ${dbConnectionCount}`);
  },
  
  setInitialized: (initialized: boolean) => {
    isDbInitialized = initialized;
    console.log(`🔗 DB Initialized: ${isDbInitialized}`);
  },
  
  isInitialized: () => isDbInitialized,
  
  getConnectionCount: () => dbConnectionCount,
  
  // Enhanced mutex with connection validation
  runExclusive: async <T>(operation: () => Promise<T>): Promise<T> => {
    return dbMutex.runExclusive(async () => {
      if (!isDbInitialized) {
        console.warn('⚠️ Database not initialized, waiting...');
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      dbConnectionManager.incrementConnection();
      try {
        const result = await operation();
        return result;
      } finally {
        dbConnectionManager.decrementConnection();
      }
    });
  }
}; 