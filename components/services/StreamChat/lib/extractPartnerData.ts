export const extractPartnerData = (channel: any, currentUserId: string) => {
  if (!channel) {
    return {
      userId: '',
      vorname: '',
      nachname: '',
      profileImageUrl: '',
      bio: '',
      kategorien: [],
    };
  }

  const isPostCreator = channel.custom_post_user_id === currentUserId;

  // Parse kategorien from channel metadata
  const parseKategorien = (kategorienString: string | undefined): string[] => {
    if (!kategorienString) return [];
    try {
      return JSON.parse(kategorienString);
    } catch (error) {
      console.warn('Failed to parse kategorien:', kategorienString);
      return [];
    }
  };

  const postKategorien = parseKategorien(channel.custom_post_kategorien);
  const userKategorien = parseKategorien(channel.custom_user_kategorien);

  return {
    userId: isPostCreator ? channel.custom_user_id ?? '' : channel.custom_post_user_id ?? '',
    vorname: isPostCreator ? channel.custom_user_vorname ?? '' : channel.custom_post_vorname ?? '',
    nachname: isPostCreator ? channel.custom_user_nachname ?? '' : channel.custom_post_nachname ?? '',
    profileImageUrl: isPostCreator ? channel.custom_user_profileImage ?? '' : channel.custom_post_profileImage ?? '',
    bio: isPostCreator ? channel.custom_user_userBio ?? '' : channel.custom_post_userBio ?? '',
    kategorien: isPostCreator ? userKategorien : postKategorien,
  };
};