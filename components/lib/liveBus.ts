// lib/liveBus.ts
type Listener = () => void;
const topics = new Map<string, Set<Listener>>();

export const liveBus = {
  subscribe(topic: string, fn: Listener) {
    if (!topics.has(topic)) topics.set(topic, new Set());
    topics.get(topic)!.add(fn);
    return () => topics.get(topic)!.delete(fn);
  },
  emit(topic: string) {
    topics.get(topic)?.forEach(fn => fn());
  },
};

// Hilfsthemen:
export const TOPIC = {
  CHANNELS: 'channels',
  MESSAGES: (cid: string) => `messages:${cid}`,
};