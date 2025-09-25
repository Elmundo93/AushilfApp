import { create } from 'zustand';

export type AsyncKey =
  | 'boot' | 'sync' | 'loadMessages' | 'sendMessage'
  | 'createChannel' | 'flushQueue' | 'loadPartner';

type State = {
  pending: Set<AsyncKey>;
  start: (k: AsyncKey) => void;
  stop: (k: AsyncKey) => void;
  isBusy: (k?: AsyncKey) => boolean;
};

export const useUiStore = create<State>((set, get) => ({
  pending: new Set(),
  start: (k) => set(s => { const p = new Set(s.pending); p.add(k); return { pending: p }; }),
  stop:  (k) => set(s => { const p = new Set(s.pending); p.delete(k); return { pending: p }; }),
  isBusy: (k) => k ? get().pending.has(k) : get().pending.size > 0,
}));