// postStore.ts
import { create } from 'zustand';
import { applyFilters } from '@/components/Pinnwand/utils/FilterLogic';
import { Post } from '@/components/types/post';

interface FilterState {
  suchenChecked: boolean;
  bietenChecked: boolean;
  categories: Record<string, boolean>;
}

interface PostState {
  posts: Post[];
  filteredPosts: Post[];
  filters: FilterState;
  loading: boolean;
  setPosts: (posts: Post[]) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: Partial<FilterState>) => void;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  filteredPosts: [],
  filters: {
    suchenChecked: false,
    bietenChecked: false,
    categories: {
      garten: false,
      haushalt: false,
      soziales: false,
      gastro: false,
      handwerk: false,
      bildung: false,
    },
  },
  loading: false,

  setPosts: (posts) => {
    // When we set posts, we apply current filters so filteredPosts stay in sync
    const { filters } = get();
    const filtered = applyFilters(posts, filters);
    set({ posts, filteredPosts: filtered });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setFilters: (newFilters) => {
    const { posts, filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    const filtered = applyFilters(posts, updatedFilters);
    set({ filters: updatedFilters, filteredPosts: filtered });
  },
}));