// services/stripe/startIdentityVerification.ts
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/components/config/supabase';
import { SUPABASE_FUNCTIONS_URL } from '@/components/lib/constants';
import * as Linking from 'expo-linking';

export async function startIdentityVerification({
  userId,
  onSuccess,
  onCancel, 
  onError,
}: {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onError?: (msg: string) => void;
}) {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (!sessionData?.session) throw new Error('Keine Session verfügbar');

    const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/createIdentitySession`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    const json = await res.json();
    console.log('[verifyIdentity] Response JSON:', json);
    const { url } = json;
    if (!url) throw new Error('Keine URL erhalten');
    
    const redirectUri = 'https://wir-helfen-aus.de/verify-identity-callback';

    const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);
    
    if (result.type === 'success') {
      console.log('✅ Identity verified');
      onSuccess?.(  );
    } else if (result.type === 'cancel') {
      console.log('❌ Identity verification cancelled');
      onCancel?.();
    }
  } catch (err: any) {
    onError?.(err.message);
  } finally {
    setTimeout(() => WebBrowser.dismissBrowser(), 500); // schützt gegen „hängenden“ Browser
  }
}