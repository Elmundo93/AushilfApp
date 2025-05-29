export const extractPartnerData = (channel: any, currentUserId: string) => {
    console.log('Extracting partner data for channel:', {
      custom_user_id: channel.custom_user_id,
      custom_post_user_id: channel.custom_post_user_id,
      currentUserId
    });

    // Wenn der aktuelle Benutzer der Post-Ersteller ist
    const isPostCreator = channel.custom_post_user_id === currentUserId;
    
    return {
      userId: isPostCreator ? channel.custom_user_id : channel.custom_post_user_id,
      vorname: isPostCreator ? channel.custom_user_vorname : channel.custom_post_vorname ?? '',
      nachname: isPostCreator ? channel.custom_user_nachname : channel.custom_post_nachname ?? '',
      profileImageUrl: isPostCreator ? channel.custom_user_profileImage : channel.custom_post_profileImage ?? '',
      bio: isPostCreator ? channel.custom_user_userBio : channel.custom_post_userBio ?? '',
    };
  };