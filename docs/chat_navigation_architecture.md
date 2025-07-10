# Chat Navigation Architecture

## Overview

The chat navigation logic has been moved from individual components to a centralized provider-based architecture. This provides better control over navigation behavior and separates concerns between UI components and navigation logic.

## Architecture Components

### 1. ChatNavigationService
**Location**: `components/services/Chat/ChatNavigationService.ts`

A static service class that handles all chat-related navigation operations:

- `initializeChatWithPost()` - Creates a new chat channel and navigates to it
- `navigateToChat()` - Navigates to an existing chat channel
- `navigateToChatList()` - Navigates back to the chat list

### 2. ChatProvider Integration
**Location**: `components/provider/ChatProvider.tsx`

The ChatProvider now exposes navigation methods through its context:

```typescript
interface ChatContextType {
  // ... existing methods
  initializeChatWithPost: (currentUser: User, postDetails: Post, options?: ChatNavigationOptions) => Promise<string | null>;
  navigateToChat: (cid: string) => void;
  navigateToChatList: () => void;
}
```

### 3. Component Usage
**Example**: `app/(authenticated)/(modal)/postDetail/index.tsx`

Components now use the navigation service through the ChatProvider:

```typescript
const { initializeChatWithPost } = useChatContext();

const handleChatPressButton = async () => {
  const channelCid = await initializeChatWithPost(user, selectedPost, {
    onLoadingStep: updateLoadingStep,
    onError: (errorMessage) => Alert.alert('Fehler', errorMessage),
    onSuccess: (cid) => console.log('Chat initialized:', cid)
  });
};
```

## Benefits

1. **Centralized Control**: All chat navigation logic is managed in one place
2. **Separation of Concerns**: UI components focus on presentation, navigation logic is handled by the service
3. **Consistent Behavior**: All chat navigation follows the same patterns
4. **Easy Testing**: Navigation logic can be tested independently
5. **Flexible Options**: Navigation methods accept options for loading states, error handling, and callbacks

## Migration

The old pattern of directly calling `handleChatPress` and managing navigation in components has been replaced with the provider-based approach. This ensures consistent behavior across the app and makes it easier to maintain and extend chat functionality.

## Usage Examples

### Initializing a new chat from a post
```typescript
const { initializeChatWithPost } = useChatContext();

const startChat = async () => {
  const cid = await initializeChatWithPost(user, post, {
    onLoadingStep: (step, message) => console.log(`Step ${step}: ${message}`),
    onError: (error) => Alert.alert('Error', error),
    onSuccess: (cid) => console.log('Chat ready:', cid)
  });
};
```

### Navigating to existing chat
```typescript
const { navigateToChat } = useChatContext();

const openChat = (cid: string) => {
  navigateToChat(cid);
};
```

### Going back to chat list
```typescript
const { navigateToChatList } = useChatContext();

const goBack = () => {
  navigateToChatList();
};
``` 