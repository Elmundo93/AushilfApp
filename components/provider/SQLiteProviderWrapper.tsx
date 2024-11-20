import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDbIfNeeded } from '../Crud/SQLite/DBSetup/DBSetup';

interface Props {
  children: React.ReactNode;
}

export const SQLiteProviderWrapper: React.FC<Props> = ({ children }) => {
  return (
    <SQLiteProvider databaseName="app.db" onInit={migrateDbIfNeeded}>
      {children}
    </SQLiteProvider>
  );
};