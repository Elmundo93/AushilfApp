// src/stores/selectedPostStore.ts
import { create } from 'zustand';
import { Post } from '@/components/types/post';

type SelectedPostState = {
  selectedPost: Post | null;
  setSelectedPost: (post: Post) => void;
};

export const useSelectedPostStore = create<SelectedPostState>((set) => ({
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
}));