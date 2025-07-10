// services/stripe/startStripeSubscriptionFlow.ts
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '@/components/config/supabase';
import { SUPABASE_FUNCTIONS_URL } from '@/components/lib/constants';

export async function startStripeSubscriptionFlow({
  userId,
  email,
  onSuccess,
  onCancel,
  onError,
}: {
  userId: string;
  email: string;
  onSuccess: () => void;
  onCancel?: () => void;
  onError?: (msg: string) => void;
}) {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data?.session?.access_token) throw new Error('Session fehlt');

    const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/createStripeSession`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, email }),
    });
    const { url } = await res.json();
    if (!url) throw new Error('Keine Checkout-URL erhalten');

    await WebBrowser.openBrowserAsync(url);

    onSuccess();
  } catch (err: any) {
    onError?.(err.message);
  } finally {
    setTimeout(() => WebBrowser.dismissBrowser(), 500); // schützt gegen „hängenden“ Browser
  }
  }
