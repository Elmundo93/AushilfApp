import { useState, useRef, useEffect } from 'react';
import { ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface UseScrollIndicatorProps {
  scrollViewRef: React.RefObject<ScrollView | null>;
  threshold?: number; // Minimum scroll distance to show indicator
  delay?: number; // Delay before showing indicator (ms)
}

export const useScrollIndicator = ({
  scrollViewRef,
  threshold = 100,
  delay = 1000,
}: UseScrollIndicatorProps) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    
    // Check if content is scrollable
    const isScrollable = contentSize.height > layoutMeasurement.height;
    const hasScrolledDown = contentOffset.y > threshold;
    
    if (isScrollable && hasScrolledDown) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Hide indicator immediately when user scrolls down
      setShowIndicator(false);
    } else if (isScrollable && !hasScrolledDown) {
      // Show indicator after delay when content is scrollable but user hasn't scrolled
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setShowIndicator(true);
      }, delay);
    }
  };

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    showIndicator,
    handleScroll,
    handleContentSizeChange,
    handleLayout,
  };
}; 