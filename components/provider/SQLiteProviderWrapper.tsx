// components/provider/SQLiteProviderWrapper.tsx
import React, { useEffect } from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { AppState } from 'react-native';

// ⚠️ Pfade an dein Projekt anpassen (Groß-/Kleinschreibung!)
import { migrateDbIfNeeded } from '../Crud/SQLite/DBSetup/DBSetup';
// Bridge an der Stelle importieren, wo du sie abgelegt hast:
import { setDB } from '@/components/Crud/SQLite/bridge';

interface Props {
  children: React.ReactNode;
}

const SQLiteProviderContent: React.FC<Props> = ({ children }) => {
  const db = useSQLiteContext();

  // Bridge früh setzen, damit Services (chatOutbox/chatSync/…) getDB() nutzen können
  useEffect(() => {
    setDB(db);
  }, [db]);

  // Re-Initialize/Migrate bei App-Foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        try {
          await migrateDbIfNeeded(db);
        } catch (e) {
          console.error('SQLite Migration on resume failed:', e);
        }
      }
    });
    return () => sub.remove();
  }, [db]);

  return <>{children}</>;
};

export const SQLiteProviderWrapper: React.FC<Props> = ({ children }) => {
  return (
    <SQLiteProvider
      databaseName="app.db"
      // Wichtig: zuerst Bridge setzen, dann migrieren.
      onInit={async (db) => {
        try {
          setDB(db);
          await migrateDbIfNeeded(db);
        } catch (e) {
          console.error('SQLite onInit failed:', e);
          throw e; // optional rethrow
        }
      }}
      onError={(error) => {
        console.error('SQLite Fehler:', error);
      }}
    >
      <SQLiteProviderContent>{children}</SQLiteProviderContent>
    </SQLiteProvider>
  );
};