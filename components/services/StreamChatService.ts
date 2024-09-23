import { User } from '../types/auth';
import { Post } from '../types/post';
import { useAuthStore } from '../stores/AuthStore';

export const handleChatPress = async (currentUser: User, postDetails: Post): Promise<string | null> => {
	const streamChatClient = useAuthStore.getState().streamChatClient;

	if (!streamChatClient) {
		throw new Error('Chat-Client konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.');
	}

	try {
		const channelId = `${currentUser.id}_${postDetails.userId}_${Date.now()}`;
		const channel = streamChatClient.channel('messaging', channelId, {
			members: [currentUser.id, postDetails.userId],
			created_by: {
				id: currentUser.id,
				name: `${currentUser.vorname} ${currentUser.nachname}`,
			},
			postVorname: postDetails.vorname,
			postNachname: postDetails.nachname,
			postLocation: postDetails.location,
			postOption: postDetails.option,
			postCategory: postDetails.category,
			userVorname: currentUser.vorname,
			userNachname: currentUser.nachname,
			userLocation: currentUser.location,
			userProfilImage: currentUser.profileImageUrl,
			postProfilImage: postDetails.userProfileImage,
		});

		await channel.create();
		return channelId;
	} catch (error) {
		console.error('Fehler beim Starten des Chats:', error);
		throw new Error('Fehler beim Starten des Chats. Bitte versuchen Sie es später erneut.');
	}
}
