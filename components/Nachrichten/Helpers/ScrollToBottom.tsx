// hooks/useScrollToBottom.ts
import { useEffect, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ChatMessage } from '@/components/types/stream';

export const useScrollToBottom = (
  flatListRef: React.RefObject<FlatList<ChatMessage>>,
  trigger: any
) => {
  const [isNearBottom, setIsNearBottom] = useState(true);
  const SCROLL_OFFSET_THRESHOLD = 150; // px from bottom (adjust as needed)

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsNearBottom(offsetY < SCROLL_OFFSET_THRESHOLD);
  };

  useEffect(() => {
    if (isNearBottom) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [trigger]);

  return {
    isNearBottom,
    onScroll,
    scrollToBottom: () => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }),
  };
};