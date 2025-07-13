// services/StreamChat/handleChatPress.ts
import { User } from '@/components/types/auth';
import { Post } from '@/components/types/post';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { StoredChannel } from '@/components/types/stream';
import { Channel } from 'stream-chat';


export const handleChatPress = async (
  currentUser: User,
  postDetails: Post
): Promise<Channel | null> => {

  // Metadaten
const getPostMetadata = (user: User, post: Post) => ({
  custom_post_option: post.option || '',
  custom_post_category: post.category || '',
  custom_post_id: parseInt(post.id) || 0,
  custom_post_user_id: post.userId || '',
  custom_post_vorname: post.vorname || '',
  custom_post_nachname: post.nachname || '',
  custom_post_profileImage: post.profileImageUrl || '',
  custom_post_userBio: post.userBio || '',
  custom_post_kategorien: JSON.stringify(post.kategorien || []),
  custom_user_vorname: user.vorname || '',
  custom_user_nachname: user.nachname || '',
  custom_user_profileImage: user.profileImageUrl || '',
  custom_user_userBio: user.bio || '',
  custom_user_id: user.id || '',
  custom_user_kategorien: JSON.stringify(user.kategorien || []),
});

// Initialnachricht
const formatInitialMessage = (post: Post) => {
  return `${post.postText}`;
};

// Hashfunktion
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
}

  const streamChatClient = useAuthStore.getState().streamChatClient;

  if (!streamChatClient) {
    console.error('❌ StreamChatClient nicht verfügbar');
    throw new Error('Chat-Client konnte nicht initialisiert werden.');
  }

  if (!currentUser.id || !postDetails.userId) {
    console.error('❌ Benutzer-IDs fehlen:', { currentUserId: currentUser.id, postUserId: postDetails.userId });
    throw new Error('Benutzer-IDs fehlen.');
  }

  try {
    console.log('🚀 Starting chat creation process...');
    
    // Eindeutige Channel-ID erzeugen
    const channelId = cyrb53(
      [currentUser.id, postDetails.userId].sort().join('-')
    );

    console.log('📝 Channel ID generated:', channelId);

    // Channel erstellen oder abrufen - GetStream.io Best Practice
    const channel = streamChatClient.channel('messaging', channelId, {
      members: [currentUser.id, postDetails.userId],
      created_by_id: currentUser.id,
      ...getPostMetadata(currentUser, postDetails),
    });

    console.log('🔧 Channel object created, initializing...');

    // CRITICAL: Initialize channel properly - GetStream.io Best Practice
    if (!channel.initialized) {
      console.log('🔄 Channel not initialized, calling watch()...');
      await channel.watch();
      console.log('✅ Channel initialized successfully');
    } else {
      console.log('ℹ️ Channel already initialized');
    }
    
    // CRITICAL: Verify channel state after initialization
    console.log('🔍 Channel state after initialization:', {
      cid: channel.cid,
      initialized: channel.initialized,
      memberCount: channel.state.members ? Object.keys(channel.state.members).length : 0,
      messageCount: channel.state.messages ? channel.state.messages.length : 0
    });

    // Get current messages with proper error handling
    console.log('📥 Querying messages for channel...');
    const { messages } = await channel.query({ 
      messages: { limit: 50 },
      watch: false // Don't watch again, we already did
    });

    console.log('📊 Messages loaded:', messages.length);

    // Initialnachricht formatieren
    const initialText = formatInitialMessage(postDetails);

    // Prüfen, ob sie bereits existiert
    const initialMessageExists = messages.some(
      (msg) => msg.text === initialText && msg.custom_type === 'initial'
    );

    // Nur senden, wenn noch nicht vorhanden
    if (!initialMessageExists) {
      console.log('📤 Sending initial message...');
      await channel.sendMessage({
        text: initialText,
        user_id: currentUser.id,
        custom_type: 'initial',
        ...getPostMetadata(currentUser, postDetails),
        initial: true,
      });
      console.log('✅ Initial message sent');
    } else {
      console.log('ℹ️ Initial message already exists');
    }

          // CRITICAL: Update local store with proper channel data
      console.log('💾 Updating local store...');
      const setChannels = useStreamChatStore.getState().setChannels;
      const setChannelsReady = useStreamChatStore.getState().setChannelsReady;
      const currentChannels = useStreamChatStore.getState().channels;
      
      // Check if channel already exists in store
      const channelExists = currentChannels.some((ch: any) => ch.cid === channel.cid);
      
      if (!channelExists) {
        // Create proper channel data following GetStream.io structure
        const channelData: StoredChannel = {
          cid: channel.cid,
          meId: currentUser.id,
          channel_id: channelId,
          channel_type: 'messaging',
          custom_post_category_choosen: postDetails.category || '',
          partner_user_id: currentUser.id === postDetails.userId ? '' : 
            (currentUser.id === postDetails.userId ? postDetails.userId : currentUser.id),
          last_message_at: new Date().toISOString(),
          last_message_text: initialText,
          unread_count: 0,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          ...getPostMetadata(currentUser, postDetails),
        };
        
        // Add to store and trigger channelsReady
        const updatedChannels = [channelData, ...currentChannels];
        setChannels(updatedChannels);
        setChannelsReady(true);
        
        console.log('✅ Channel added to store:', channel.cid);
        console.log('📊 Store now contains channels:', updatedChannels.map(ch => ch.cid));
        

        
        // Verify channel was added
        const verifyChannels = useStreamChatStore.getState().channels;
        const channelAdded = verifyChannels.some(ch => ch.cid === channel.cid);
        console.log('🔍 Verification - Channel in store:', channelAdded);
        
        if (!channelAdded) {
          console.error('❌ Channel was not properly added to store');
          throw new Error('Channel konnte nicht zum Store hinzugefügt werden');
        }
      } else {
        console.log('ℹ️ Channel already exists in store:', channel.cid);
      }

    // CRITICAL: Ensure channel is properly initialized in StreamChat client
    console.log('🔧 Finalizing channel setup...');
    
    // Mark channel as read
    await channel.markRead();
    console.log('✅ Channel marked as read');

    // Verify channel state
    console.log('🔍 Final channel state:', {
      cid: channel.cid,
      initialized: channel.initialized,
      memberCount: channel.state.members ? Object.keys(channel.state.members).length : 0,
      messageCount: channel.state.messages ? channel.state.messages.length : 0
    });

    return channel;
  } catch (error: any) {
    console.error('❌ Fehler beim Starten des Chats:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      currentUser: currentUser.id,
      postDetails: postDetails.id
    });
    throw new Error(`Chat konnte nicht gestartet werden: ${error.message}`);
  }
};
