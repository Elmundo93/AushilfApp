// services/stripe/startIdentityVerification.ts
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/components/config/supabase';
import { SUPABASE_FUNCTIONS_URL } from '@/components/lib/constants';

export async function startIdentityVerification({
  userId,
  onError,
}: {
  userId: string;
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

    await WebBrowser.openBrowserAsync(url);
  } catch (err: any) {
    onError?.(err.message);
  }
}