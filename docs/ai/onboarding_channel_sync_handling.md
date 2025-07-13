# Onboarding Channel Sync Error Handling

## Problem
During the onboarding process, when users add their location, the app triggers a full sync including channel synchronization. However, at this point in the onboarding flow, the `StreamChatClient` is not fully initialized or connected, which causes the error:

```
Both secret and user tokens are not set. Either client.connectUser wasn't called or client.disconnect was called
```

This error was causing the app to show error alerts and potentially crash during onboarding.

## Solution

### 1. Enhanced ChannelSync Error Handling

**File:** `components/services/Storage/Syncs/ChannelSync.ts`

- Added onboarding status check to skip StreamChat sync during onboarding
- Added specific error handling for StreamChat initialization errors
- Implemented graceful fallback to local channel data
- Added detailed logging for debugging

**Key Changes:**
```typescript
// Check if user is still in onboarding (not fully authenticated)
const isInOnboarding = user && !user.onboarding_completed;

if (isInOnboarding) {
  console.log('📝 User is in onboarding - skipping Stream Chat sync to avoid initialization issues');
  console.log('ℹ️ Channel sync will be available after onboarding completion');
} else if (isOnline && streamChatClient) {
  // Normal sync logic
}
```

### 2. Improved DataProvider Error Handling

**File:** `components/provider/DataProvider.tsx`

- Added onboarding-aware error handling
- Skip error alerts during onboarding
- Added specific handling for StreamChat initialization errors
- Prevent retry loops for expected onboarding errors

**Key Changes:**
```typescript
// Handle specific StreamChat initialization errors during onboarding
if (isOnboarding && e.message && e.message.includes('Both secret and user tokens are not set')) {
  console.log(`ℹ️ ${name} sync skipped during onboarding - this is expected`);
  return; // Don't retry, just return gracefully
}
```

### 3. ChatProvider Onboarding Checks

**File:** `components/provider/ChatProvider.tsx`

- Added onboarding checks before triggering channel sync
- Skip network-triggered syncs during onboarding
- Added onboarding check in message sync function

**Key Changes:**
```typescript
// Only sync if user is not in onboarding
if (user && user.onboarding_completed) {
  syncChannels();
} else {
  console.log('ℹ️ Skipping channel sync during onboarding');
}
```

## Benefits

1. **No More Error Alerts**: Users no longer see confusing error messages during onboarding
2. **Graceful Degradation**: App continues to work with local data even when StreamChat is not available
3. **Better User Experience**: Onboarding flow is smoother without interruptions
4. **Proper Logging**: Clear console logs help with debugging
5. **Expected Behavior**: Channel sync becomes available after onboarding completion

## Expected Behavior

- **During Onboarding**: Channel sync is skipped gracefully with informative logs
- **After Onboarding**: Full channel sync functionality is available
- **Error Scenarios**: Local data is used as fallback, no app crashes
- **Network Changes**: Sync only triggers when user is fully authenticated

## Testing

The error handling can be verified by:
1. Starting onboarding process
2. Adding location (which triggers sync)
3. Checking console logs for graceful handling messages
4. Verifying no error alerts appear
5. Completing onboarding and verifying channel sync works normally 