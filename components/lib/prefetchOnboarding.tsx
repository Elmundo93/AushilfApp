import { Image } from 'react-native';

const AVATAR_COLLECTIONS = [
  {
    baseUrl: 'https://api.dicebear.com/7.x/avataaars/png?seed=',
    seeds: ['Andrea', 'Jude', 'Chase', 'Vivian', 'Maria', 'Liliana', 'Ryker', 'Aiden'],
  },
  {
    baseUrl: 'https://api.dicebear.com/7.x/adventurer/png?seed=',
    seeds: ['Jude', 'Vivian', 'Jade', 'Liliana', 'Aiden', 'Andrea', 'Sadie'],
  },
  {
    baseUrl: 'https://api.dicebear.com/7.x/notionists/png?seed=',
    seeds: ['Sara', 'Riley', 'Ryan', 'Andrea', 'Adrian', 'Liliana', 'Vivian', 'Maria', 'Jameson'],
  }
];

export const prefetchAvatars = async () => {
  try {
    console.log('🔄 Starting avatar prefetch...');
    const allUrls = AVATAR_COLLECTIONS.flatMap(({ baseUrl, seeds }) =>
      seeds.map((seed) => `${baseUrl}${seed}`)
    );
    
    console.log(`📦 Prefetching ${allUrls.length} avatars...`);
    
    // Prefetch with individual error handling
    const prefetchPromises = allUrls.map(async (url) => {
      try {
        await Image.prefetch(url);
        return { url, success: true };
      } catch (error) {
        console.warn(`⚠️ Failed to prefetch avatar: ${url}`, error);
        return { url, success: false, error };
      }
    });
    
    const results = await Promise.allSettled(prefetchPromises);
    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;
    
    console.log(`✅ Avatar prefetch completed: ${successful}/${allUrls.length} successful`);
  } catch (error) {
    console.error('❌ Error prefetching avatars:', error);
    // Don't throw the error, just log it to prevent app crashes
  }
};