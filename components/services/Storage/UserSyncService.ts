import { SQLiteDatabase } from 'expo-sqlite';
import { supabase } from '@/components/config/supabase';
import { loadUserInfo, saveUserInfo, deleteUserInfo } from '@/components/Crud/SQLite/Services/UserInfoService';
import { User } from '@/components/types/auth';
import { useAuthStore } from '@/components/stores/AuthStore';

export async function syncFromSupabase(db: SQLiteDatabase, userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Fehler beim Supabase-Fetch:', error);
    return null;
  }

  const user: User = {
    id: data.id,
    created_at: data.created_at,
    location: data.location,
    vorname: data.vorname,
    nachname: data.nachname,
    email: data.email,
    profileImageUrl: data.profileImageUrl,
    bio: data.bio,
    straße: data.straße,
    hausnummer: data.hausnummer,
    plz: data.plz,
    wohnort: data.wohnort,
    telefonnummer: data.telefonnummer,
    steuernummer: data.steuernummer ?? '',
  };

  await saveUserInfo(db, user);
  useAuthStore.getState().setUser(user);
  return user;
}

export async function pushUserToSupabase(user: User): Promise<boolean> {
  if (!user.id) return false;

  const { error } = await supabase
    .from('Users')
    .update({
      vorname: user.vorname,
      nachname: user.nachname,
      email: user.email,
      location: user.location,
      profileImageUrl: user.profileImageUrl,
      bio: user.bio,
      straße: user.straße,
      hausnummer: user.hausnummer,
      plz: user.plz,
      wohnort: user.wohnort,
      telefonnummer: user.telefonnummer,
      
    })
    .eq('id', user.id);

  if (error) {
    console.error('Fehler beim Push an Supabase:', error);
    return false;
  }

  return true;
}

export async function saveAndSyncUserLocally(db: SQLiteDatabase, updatedUser: User) {
  useAuthStore.getState().setUser(updatedUser);
  await saveUserInfo(db, updatedUser);
  await pushUserToSupabase(updatedUser);
}

export async function loadUserFromLocal(db: SQLiteDatabase): Promise<User | null> {
  const user = await loadUserInfo(db);
  if (user) useAuthStore.getState().setUser(user);
  return user;
}

export async function clearUserData(db: SQLiteDatabase) {
  await deleteUserInfo(db);
  useAuthStore.getState().reset();
}