# Scroll Indicator Component

A graceful, animated scroll indicator that appears when content is scrollable and guides users to scroll down.

## Features

- **Smooth animations**: Fade in/out with gentle bounce effect
- **Smart detection**: Only shows when content is actually scrollable
- **Auto-hide**: Disappears when user starts scrolling
- **Interactive**: Users can tap to scroll to bottom
- **Customizable**: Configurable delay and threshold
- **Design consistent**: Matches app's orange gradient theme

## Usage

### Basic Implementation

```tsx
import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import { ScrollIndicator } from '@/components/Animation/ScrollIndicator';
import { useScrollIndicator } from '@/components/hooks/useScrollIndicator';

export default function MyScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { showIndicator, handleScroll, handleContentSizeChange, handleLayout } = useScrollIndicator({
    scrollViewRef,
    threshold: 50,    // Show indicator after scrolling 50px
    delay: 1500,      // Wait 1.5 seconds before showing
  });

  const handleScrollIndicatorPress = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Your content */}
      </ScrollView>
      
      <ScrollIndicator 
        isVisible={showIndicator} 
        onPress={handleScrollIndicatorPress}
      />
    </View>
  );
}
```

### Configuration Options

#### useScrollIndicator Hook

- `scrollViewRef`: Reference to the ScrollView component
- `threshold` (optional): Minimum scroll distance before hiding indicator (default: 100px)
- `delay` (optional): Delay before showing indicator (default: 1000ms)

#### ScrollIndicator Component

- `isVisible`: Boolean to control visibility
- `onPress` (optional): Function called when indicator is tapped

## Implementation Details

### Animation Behavior

1. **Fade In**: Smooth opacity transition when content becomes scrollable
2. **Bounce Effect**: Continuous gentle up/down movement to draw attention
3. **Fade Out**: Quick fade when user starts scrolling or content is no longer scrollable

### Smart Detection

The indicator only appears when:
- Content height > ScrollView height (content is scrollable)
- User hasn't scrolled past the threshold
- After the specified delay

### Performance

- Uses `useNativeDriver: true` for smooth animations
- `scrollEventThrottle={16}` for optimal scroll performance
- Automatic cleanup of timeouts on component unmount

## Styling

The indicator uses the app's design system:
- Orange gradient background (`#ff9a00` to `#ffc300`)
- White chevron-down icon
- Subtle shadow for depth
- 50x50px circular design
- Positioned at bottom center

## Example Implementation

See `app/(public)/(onboarding)/conclusion.tsx` for a complete implementation example. 