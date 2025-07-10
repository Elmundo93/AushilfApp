import { useLoading as useLoadingContext } from '@/components/provider/LoadingContext';

/**
 * Custom hook that provides a safe loading state
 * When global loading is active, this hook returns false to prevent
 * other loading components from interfering with the global loading modal
 */
export const useSafeLoading = (localLoading: boolean): boolean => {
  const { isGlobalLoading } = useLoadingContext();
  
  // If global loading is active, disable local loading to prevent conflicts
  if (isGlobalLoading) {
    return false;
  }
  
  return localLoading;
}; 