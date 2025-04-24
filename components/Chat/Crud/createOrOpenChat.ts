import { supabase } from '@/lib/supabase';
import { useChatStore } from '@/stores/useChatStore';
import { v4 as uuidv4 } from 'uuid';

export async function createOrOpenChat(currentUser: User, post: Post) {
  const userIds = [currentUser.id, post.userId].sort();
  const post_id = post.id;

  const existing = await supabase
    .from('chats')
    .select('*')
    .eq('user1', userIds[0])
    .eq('user2', userIds[1])
    .eq('post_id', post_id)
    .maybeSingle();

  if (existing.data) return existing.data.id;

  const newChat = {
    id: uuidv4(),
    user1: userIds[0],
    user2: userIds[1],
    post_id,
    post_text: post.postText,
    category: post.category,
    option: post.option,

    post_author_id: post.userId,
    post_author_vorname: post.vorname,
    post_author_nachname: post.nachname,
    post_author_profile_image: post.profileImageUrl,
    post_author_bio: post.userBio,

    initiator_vorname: currentUser.vorname,
    initiator_nachname: currentUser.nachname,
    initiator_profile_image: currentUser.profileImageUrl,
    initiator_bio: currentUser.bio,
  };

  const { data, error } = await supabase.from('chats').insert(newChat).select().single();

  if (error) {
    console.error('Fehler beim Erstellen des Chats:', error);
    throw error;
  }

  return data.id;
}