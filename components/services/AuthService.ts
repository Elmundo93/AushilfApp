import { supabase } from "../config/supabase";
import { User } from "../types/auth";
import * as SecureStore from 'expo-secure-store';
import { StreamChat } from 'stream-chat';
import { useAuthStore } from '../stores/AuthStore';
import { Session } from '@supabase/supabase-js';

const initializeStreamClient = (apiKey: string) => {
  return StreamChat.getInstance(apiKey);
};

const authenticateUser = async (userData: User, session: Session) => {
  if (!session) {
    throw new Error('No valid session found');
  }

  console.log('Authenticating user:', userData.id);

  // Generate GetStream token
  console.log('Requesting GetStream token...');
  const response = await fetch('http://127.0.0.1:54321/functions/v1/getStreamTokens', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ userId: userData.id }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error fetching GetStream token:', errorText);
    throw new Error('Failed to fetch GetStream token');
  }

  const { token: streamToken, apiKey: streamApiKey } = await response.json();
  console.log('Received GetStream token and API key');

  if (!streamToken || !streamApiKey) {
    console.error('GetStream token or API key is missing');
    throw new Error('GetStream token or API key is missing');
  }

  // Initialize StreamChat client
  console.log('Initializing StreamChat client...');
  const client = initializeStreamClient(streamApiKey);

  // Connect user to StreamChat
  console.log('Connecting user to StreamChat...');
  await client.connectUser(
    {
      id: userData.id,
      name: `${userData.vorname} ${userData.nachname}`,
    },
    streamToken
  );

  console.log('User connected to StreamChat');

  // Calculate expiry date (6 days from now)
  const expiryDate = new Date(Date.now() + 60 * 60 * 24 * 6 * 1000);

  // Save data in SecureStore
  console.log('Saving data in SecureStore...');
  await SecureStore.setItemAsync('user', JSON.stringify(userData));
  await SecureStore.setItemAsync('streamToken', streamToken);
  await SecureStore.setItemAsync('tokenExpiry', expiryDate.toString());

  // Update AuthStore
  console.log('Updating AuthStore...');
  const authStore = useAuthStore.getState();
  authStore.setUser(userData);
  authStore.setToken(streamToken);
  authStore.setStreamChatClient(client);
  authStore.setAuthenticated(true);

  console.log('Authentication process completed');

  return { userData, streamClient: client };
};

export const signUp = async (email: string, password: string, userData: User) => {
  try {
    console.log('Starting registration process for:', email);
    const authStore = useAuthStore.getState();
    authStore.setIsLoading(true);
    authStore.setError(null);

    console.log('Attempting Supabase sign-up...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Supabase sign-up error:', authError.message);
      throw authError;
    }

    console.log('Supabase sign-up successful');

    if (!authData.user || !authData.session) {
      console.error('User or session not found after sign-up');
      throw new Error('User or session not found after sign-up');
    }

    console.log('Saving session data...');
    await SecureStore.setItemAsync('supabaseSession', JSON.stringify(authData.session));
    const { access_token, refresh_token } = authData.session;
    await SecureStore.setItemAsync('accessToken', access_token);
    await SecureStore.setItemAsync('refreshToken', refresh_token);
    console.log('Session data saved');

    console.log('Setting Supabase session...');
    await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    console.log('Inserting user data into database...');
    const { data: insertedUser, error: insertError } = await supabase
      .from('Users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        vorname: userData.vorname,
        nachname: userData.nachname,
        location: userData.location,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting user data:', insertError.message);
      throw insertError;
    }

    console.log('User data inserted successfully');

    console.log('Starting user authentication...');
    const result = await authenticateUser(insertedUser as User, authData.session);
    console.log('User authentication completed');

    authStore.setIsLoading(false);
    console.log('Registration process completed successfully');

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error('Registration error:', error instanceof Error ? error.message : error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const authStore = useAuthStore.getState();
    authStore.setError(errorMessage);
    authStore.setIsLoading(false);
    return { success: false, error: errorMessage };
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  try {
    console.log('Starting sign-in process for:', email);
    const authStore = useAuthStore.getState();
    authStore.setIsLoading(true);
    authStore.setError(null);

    console.log('Attempting Supabase sign-in...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase sign-in error:', error.message);
      authStore.setError(error.message);
      authStore.setIsLoading(false);
      throw error;
    }

    console.log('Supabase sign-in successful');

    if (!data.session || !data.user) {
      console.error('Session or user not found after sign-in');
      throw new Error('Session or user not found after sign-in');
    }

    console.log('Fetching user data from database...');
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError.message);
      throw userError;
    }

    console.log('User data retrieved successfully');

    console.log('Saving session data...');
    await SecureStore.setItemAsync('supabaseSession', JSON.stringify(data.session));
    const { access_token, refresh_token } = data.session;
    await SecureStore.setItemAsync('accessToken', access_token);
    await SecureStore.setItemAsync('refreshToken', refresh_token);
    console.log('Session data saved');

    console.log('Starting user authentication...');
    const result = await authenticateUser(userData, data.session);
    console.log('User authentication completed');

    authStore.setIsLoading(false);
    console.log('Sign-in process completed successfully');

    return result;
  } catch (error) {
    console.error('Sign-in error:', error instanceof Error ? error.message : error);
    const authStore = useAuthStore.getState();
    authStore.setError(error instanceof Error ? error.message : 'Unknown error');
    authStore.setIsLoading(false);
    throw error;
  }
};

export const signOut = async () => {
  try {
    console.log('Starting sign-out process');
    const authStore = useAuthStore.getState();
    authStore.setIsLoading(true);
    authStore.setError(null);

    console.log('Attempting Supabase sign-out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase sign-out error:', error.message);
      throw error;
    }

    console.log('Supabase sign-out successful');

    const streamClient = authStore.streamChatClient;
    if (streamClient) {
      console.log('Disconnecting user from StreamChat...');
      await streamClient.disconnectUser();
      console.log('User disconnected from StreamChat');
    }

    console.log('Deleting stored data...');
    await SecureStore.deleteItemAsync('user');
    await SecureStore.deleteItemAsync('streamToken');
    await SecureStore.deleteItemAsync('supabaseSession');
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    console.log('Stored data deleted');

    console.log('Resetting AuthStore...');
    authStore.reset();
    authStore.setIsLoading(false);
    console.log('Sign-out process completed successfully');
  } catch (error) {
    console.error('Sign-out error:', error instanceof Error ? error.message : error);
    const authStore = useAuthStore.getState();
    authStore.setError(error instanceof Error ? error.message : 'Unknown error');
    authStore.setIsLoading(false);
    throw error;
  }
};