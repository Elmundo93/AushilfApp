import { User } from '@/components/types/auth';
import { Post } from '@/components/types/post';
import { handleChatPress } from '@/components/services/StreamChat/StreamChatService';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { router } from 'expo-router';
import { useLoading } from '@/components/provider/LoadingContext';
import { useCallback } from 'react';

export interface ChatNavigationOptions {
  showLoading?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (channelCid: string) => void;
}

export const useChatNavigation = () => {
  const { showGlobalLoading, hideGlobalLoading, updateLoadingProgress } = useLoading();

  /**
   * Initialize chat with a post and navigate to the chat
   */
  const initializeChatWithPost = useCallback(async (
    currentUser: User,
    postDetails: Post,
    options: ChatNavigationOptions = {}
  ): Promise<string | null> => {
    const {
      showLoading = true,
      onError,
      onSuccess
    } = options;

    try {
      console.log('🎬 ChatNavigationService: Starting chat initialization...');
      
      // Show loading immediately
      if (showLoading) {
        console.log('🎬 ChatNavigationService: Showing loading modal...');
        await showGlobalLoading('Chat wird initialisiert...', 2000); // Auto-hide after 2 seconds
        console.log('✅ ChatNavigationService: Loading modal shown');
      }

      // Initialize chat
      console.log('🚀 ChatNavigationService: Starting chat creation process...');
      const channel = await handleChatPress(currentUser, postDetails);
      
      if (!channel) {
        throw new Error('Channel konnte nicht erstellt werden');
      }

      // Update loading progress
      if (showLoading) {
        console.log('🔄 ChatNavigationService: Updating to step 2 - Chat wird vorbereitet...');
        updateLoadingProgress(2, 'Chat wird vorbereitet...');
        console.log('✅ ChatNavigationService: Step 2 update completed');
        
        // Wait a bit for the user to see the progress
        console.log('⏰ ChatNavigationService: Waiting 300ms for step 2 to be visible...');
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Set active chat
      const { setCid } = useActiveChatStore.getState();
      await setCid(channel.cid);
      console.log('✅ ChatNavigationService: Active chat CID set:', channel.cid);
      
      // Update loading progress
      if (showLoading) {
        console.log('🔄 ChatNavigationService: Updating to step 3 - Navigation wird vorbereitet...');
        updateLoadingProgress(3, 'Navigation wird vorbereitet...');
        console.log('✅ ChatNavigationService: Step 3 update completed');
        
        // Wait a bit for the user to see the final step
        console.log('⏰ ChatNavigationService: Waiting 300ms for step 3 to be visible...');
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Start navigation in background while loading is still visible
      console.log('🚀 ChatNavigationService: Starting navigation in background...');
      console.log('🚀 ChatNavigationService: Navigating to nachrichten list...');
      router.replace('/(authenticated)/(aushilfapp)/nachrichten');

      setTimeout(() => {
        console.log('🚀 ChatNavigationService: Navigating to specific channel:', channel.cid);
        router.push({
          pathname: '/nachrichten/channel/[cid]',
          params: { cid: channel.cid },
        });
      }, 200);

      // Loading will auto-hide after 2 seconds due to duration parameter

      onSuccess?.(channel.cid);
      return channel.cid;

    } catch (error: any) {
      console.error('❌ ChatNavigationService: Error in initializeChatWithPost:', error);
      const errorMessage = error.message || 'Ein Fehler ist aufgetreten';
      
      // Hide loading on error
      if (showLoading) {
        await hideGlobalLoading();
      }
      
      onError?.(errorMessage);
      return null;
    }
  }, [showGlobalLoading, hideGlobalLoading, updateLoadingProgress]);

  /**
   * Navigate to an existing chat channel
   */
  const navigateToChat = useCallback((cid: string): void => {
    const { setCid } = useActiveChatStore.getState();
    setCid(cid);
    
    router.push({
      pathname: '/nachrichten/channel/[cid]',
      params: { cid },
    });
  }, []);

  /**
   * Navigate back to the chat list
   */
  const navigateToChatList = useCallback((): void => {
    const { setCid } = useActiveChatStore.getState();
    setCid(null);
    
    router.push('/nachrichten');
  }, []);

  return {
    initializeChatWithPost,
    navigateToChat,
    navigateToChatList,
  };
}; 