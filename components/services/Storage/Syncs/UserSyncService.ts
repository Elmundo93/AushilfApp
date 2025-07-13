// components/services/Storage/Syncs/UserSyncService.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { supabase } from '@/components/config/supabase';
import { loadUserInfo, saveUserInfo, deleteUserInfo } from '@/components/Crud/SQLite/Services/UserInfoService';
import { User } from '@/components/types/auth';
import { useAuthStore } from '@/components/stores/AuthStore';

export async function syncFromSupabase(db: SQLiteDatabase, userId: string): Promise<User | null> {
  try {
    if (!db || !userId) {
      console.warn('⚠️ Database or userId not available for syncFromSupabase');
      return null;
    }

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
      kategorien: data.kategorien ?? [],
      onboarding_completed: data.onboarding_completed ?? false,
      is_id_verified: data.is_id_verified ?? false,
      id_veried_name_match: data.id_veried_name_match ?? false,
    };

    await saveUserInfo(db, user);
    useAuthStore.getState().setUser(user);
    console.log('synced from supabase as user:', user);
    return user;
  } catch (error) {
    console.error('❌ Error in syncFromSupabase:', error);
    return null;
  }
}

export async function pushUserToSupabase(user: User): Promise<boolean> {
  try {
    if (!user?.id) {
      console.warn('⚠️ User ID not available for pushUserToSupabase');
      return false;
    }

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
        steuernummer: user.steuernummer,
        kategorien: user.kategorien ?? [],
        onboarding_completed: user.onboarding_completed ?? false,
        is_id_verified: user.is_id_verified ?? false,
        id_verified_name_match: user.id_veried_name_match ?? false,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Fehler beim Push an Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error in pushUserToSupabase:', error);
    return false;
  }
}

export async function saveAndSyncUserLocally(db: SQLiteDatabase, updatedUser: User) {
  try {
    if (!db || !updatedUser?.id) {
      console.warn('⚠️ Database or user not available for saveAndSyncUserLocally');
      return;
    }

    useAuthStore.getState().setUser(updatedUser);
    await saveUserInfo(db, updatedUser);
    await pushUserToSupabase(updatedUser);
  } catch (error) {
    console.error('❌ Error in saveAndSyncUserLocally:', error);
  }
}

export async function loadUserFromLocal(db: SQLiteDatabase): Promise<User | null> {
  try {
    if (!db) {
      console.warn('⚠️ Database not available for loadUserFromLocal');
      return null;
    }

    const user = await loadUserInfo(db);
    if (user) useAuthStore.getState().setUser(user);
    console.log('synced from local as user:', useAuthStore.getState());
    return user;
  } catch (error) {
    console.error('❌ Error in loadUserFromLocal:', error);
    return null;
  }
}

export async function clearUserData(db: SQLiteDatabase) {
  try {
    if (!db) {
      console.warn('⚠️ Database not available for clearUserData');
      return;
    }

    await deleteUserInfo(db);
  } catch (error) {
    console.error('❌ Error in clearUserData:', error);
  }
}