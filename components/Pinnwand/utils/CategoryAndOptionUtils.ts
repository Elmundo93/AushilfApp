import { CategoryStyles, CategoryIcons, CategoryType } from '@/components/types/stream';

export const CATEGORIES: CategoryType[] = ['garten', 'haushalt', 'gastro', 'soziales', 'handwerk', 'bildung'];

export const getBackgroundForCategory = (category: string): CategoryStyles => {
  const backgrounds = {
    garten: { backgroundColor: 'lightgreen' },
    haushalt: { backgroundColor: 'lightblue' },
    gastro: { backgroundColor: 'rgb(255, 255, 102)' },
    soziales: { backgroundColor: 'rgb(255, 102, 102)' },
    handwerk: { backgroundColor: 'orange' },
    bildung: { backgroundColor: 'lightgrey' },
  };
  return backgrounds[category as CategoryType] || { backgroundColor: 'transparent' };
};

export const getIconForCategory = (category: string) => {
  const icons: CategoryIcons = {
    garten: require('@/assets/images/GartenIcon.png'),
    haushalt: require('@/assets/images/HaushaltIcon.png'),
    gastro: require('@/assets/images/GastroIcon.png'),
    soziales: require('@/assets/images/SozialesIcon.png'),
    handwerk: require('@/assets/images/HandwerkIcon.png'),
    bildung: require('@/assets/images/BildungsIcon.png'),
  };
  return icons[category] || null;
};