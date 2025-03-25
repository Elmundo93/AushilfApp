import { Post } from '@/components/types/post';

interface FilterState {
  suchenChecked: boolean;
  bietenChecked: boolean;
  categories: Record<string, boolean>; // e.g., { garten: true, haushalt: false }
}

export const applyFilters = (posts: Post[], filters: FilterState): Post[] => {
  const { suchenChecked, bietenChecked, categories } = filters;

  let filtered = posts;

  // Option-based filtering
  if (suchenChecked || bietenChecked) {
    filtered = filtered.filter(post =>
      suchenChecked ? post.option === 'suchen' : post.option === 'bieten'
    );
  }

  // Category-based filtering
  const activeCategories = Object.keys(categories).filter(key => categories[key]);

  if (activeCategories.length > 0) {
    filtered = filtered.filter(post => activeCategories.includes(post.category));
  }

  return filtered;
};