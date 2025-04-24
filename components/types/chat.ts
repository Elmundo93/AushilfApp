type Chat = {
    id: string;
    user1: string;
    user2: string;
    blocked_by: string | null;
    created_at: string;
  
    post_id?: string;
    post_text?: string;
    category?: string;
    option?: string;
  
    post_author_id?: string;
    post_author_vorname?: string;
    post_author_nachname?: string;
    post_author_profile_image?: string;
    post_author_bio?: string;
  
    initiator_vorname?: string;
    initiator_nachname?: string;
    initiator_profile_image?: string;
    initiator_bio?: string;
  };