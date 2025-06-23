import React, { useEffect } from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { migrateDbIfNeeded } from '../Crud/SQLite/DBSetup/DBSetup';
import { AppState } from 'react-native';

interface Props {
  children: React.ReactNode;
}

const SQLiteProviderContent: React.FC<Props> = ({ children }) => {
  const db = useSQLiteContext();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // Datenbank neu initialisieren wenn App in den Vordergrund kommt
        migrateDbIfNeeded(db);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [db]);

  return <>{children}</>;
};

export const SQLiteProviderWrapper: React.FC<Props> = ({ children }) => {
  return (
    <SQLiteProvider 
      databaseName="app.db" 
      onInit={migrateDbIfNeeded}
      onError={(error) => {
        console.error('SQLite Fehler:', error);
      }}
    >
      <SQLiteProviderContent>{children}</SQLiteProviderContent>
    </SQLiteProvider>
  );
};