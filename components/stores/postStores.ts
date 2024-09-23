import { create } from 'zustand';

interface PostStore {
  postCount: number;
  incrementPostCount: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
  postCount: 0,
  incrementPostCount: () => set((state) => ({ postCount: state.postCount + 1 })),
}));