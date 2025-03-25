import { create } from 'zustand';
import { Post } from '../types/post';

interface PostStore {
  postCount: number;
  incrementPostCount: () => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

export const usePostCountStore = create<PostStore>((set) => ({
  postCount: 0,
  incrementPostCount: () => set((state) => ({ postCount: state.postCount + 1 })),
  posts: [],
  setPosts: (posts: Post[]) => set({ posts }),
}));
