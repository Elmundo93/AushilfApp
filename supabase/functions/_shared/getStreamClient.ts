// _shared/getStreamClient.ts
import { StreamChat } from 'npm:stream-chat';

export function getStreamClient(_req: Request) {
  const apiKey = Deno.env.get('STREAM_API_KEY');
  const apiSecret = Deno.env.get('STREAM_API_SECRET');

  if (!apiKey || !apiSecret) throw new Error('Fehlende Stream-Konfiguration');

  return StreamChat.getInstance(apiKey, apiSecret);
}