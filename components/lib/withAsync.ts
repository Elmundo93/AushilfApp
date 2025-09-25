// components/lib/withAsync.ts
import { useUiStore } from '@/components/stores/useUIStore';
import type { AsyncKey } from '@/components/stores/useUIStore';

export async function withAsync<T>(key: AsyncKey, fn: () => Promise<T>) {
  const { start, stop } = useUiStore.getState();
  start(key);
  try { return await fn(); } finally { stop(key); }
}