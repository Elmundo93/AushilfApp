export const extractPartnerData = (channel: any, currentUserId: string) => {
  if (!channel) {
    console.warn('extractPartnerData: channel is undefined');
    return {
      userId: '',
      vorname: '',
      nachname: '',
      profileImageUrl: '',
      bio: '',
    };
  }

  console.log('Extracting partner data for channel:', {
    custom_user_id: channel.custom_user_id,
    custom_post_user_id: channel.custom_post_user_id,
    currentUserId,
  });

  const isPostCreator = channel.custom_post_user_id === currentUserId;

  return {
    userId: isPostCreator ? channel.custom_user_id ?? '' : channel.custom_post_user_id ?? '',
    vorname: isPostCreator ? channel.custom_user_vorname ?? '' : channel.custom_post_vorname ?? '',
    nachname: isPostCreator ? channel.custom_user_nachname ?? '' : channel.custom_post_nachname ?? '',
    profileImageUrl: isPostCreator ? channel.custom_user_profileImage ?? '' : channel.custom_post_profileImage ?? '',
    bio: isPostCreator ? channel.custom_user_userBio ?? '' : channel.custom_post_userBio ?? '',
    kategorien: channel.custom_post_category ? [channel.custom_post_category] : [],
  };
};