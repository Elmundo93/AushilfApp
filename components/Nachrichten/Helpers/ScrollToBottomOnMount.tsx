// components/Nachrichten/Helpers/ScrollToBottomOnMount.tsx
import { useEffect } from 'react';
import { FlatList } from 'react-native';
import { ChatMessage } from '@/components/types/stream';

type ScrollToBottomProps = {
  flatListRef: React.RefObject<FlatList<ChatMessage>>;
  enabled?: boolean;
};

export const ScrollToBottomOnMount = ({ flatListRef, enabled = true }: ScrollToBottomProps) => {
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, 50); // Warte, bis FlatList-Mount abgeschlossen ist

    return () => clearTimeout(timer);
  }, [enabled]);

  return null;
};