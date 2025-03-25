// AuthProvider.tsx
import React, { PropsWithChildren} from 'react';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuthStore } from '@/components/stores/AuthStore';



const AuthProvider = ({ children }: PropsWithChildren) => {
  const authState = useAuthStore();
  const { 
    user, 
    token, 
    streamChatClient
  } = authState;



  return (
    <OverlayProvider>
     
      {user && token && streamChatClient ? (
        <Chat client={streamChatClient}>{children}</Chat>
      ) : (
        children
      )}
    </OverlayProvider>
  );
};

export default AuthProvider;