// components/Nachrichten/CustomChatHeader.tsx
import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NachrichtenMenu from '../NachrichtenMenu';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useSQLiteContext } from 'expo-sqlite';
import { adjustCategory } from '@/components/Crud/SQLite/Services/channelServices';
import { styles } from './customHStyles';

// Category icons
import GastroIconWithBackground from '@/assets/images/GastroIconWithBackground.png';
import GartenIconWithBackground from '@/assets/images/GartenIconWithBackground.png';
import HaushaltWithBackground from '@/assets/images/HaushaltWithBackground.png';
import SozialesIconWithBackground from '@/assets/images/SozialesIconWithBackground.png';
import HandwerkIconWithBackground from '@/assets/images/HandwerkIconWithBackground.png';
import BildungsIconWithBackground from '@/assets/images/BildungsIconWithBackground.png';

const categoryIcons = {
  gastro: GastroIconWithBackground,
  garten: GartenIconWithBackground,
  haushalt: HaushaltWithBackground,
  soziales: SozialesIconWithBackground,
  handwerk: HandwerkIconWithBackground,
  bildung: BildungsIconWithBackground,
};

const categoryLabels = {
  gastro: 'Gastro',
  garten: 'Garten',
  haushalt: 'Haushalt',
  soziales: 'Soziales',
  handwerk: 'Handwerk',
  bildung: 'Bildung',
};

type Props = {
  otherUserImage: string;
  categoryIcon: any;
  otherUserName?: string;
  channel?: any; // Add channel prop for direct access
};

const CustomChatHeader: React.FC<Props> = ({
  otherUserImage,
  otherUserName = '',
  categoryIcon,
  channel: passedChannel,
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { fontSize } = useContext(FontSizeContext);
  const { cid } = useActiveChatStore();
  const { channels } = useStreamChatStore();
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Use passed channel or find it in the store
  const channel = passedChannel || channels.find((ch) => ch.cid === cid) || 
                  channels.find((ch) => ch.channel_id === cid) ||
                  (cid ? channels.find((ch) => ch.cid?.includes(cid) || cid?.includes(ch.cid)) : null);
  
  const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
  const isValidCategory = (category: string) => validCategories.includes(category);
  
  const currentCategory = (channel?.custom_post_category_choosen && isValidCategory(channel.custom_post_category_choosen)) 
    ? channel.custom_post_category_choosen 
    : channel?.custom_post_category || '';

  const adjustedFontSize = Math.min((fontSize / 24) * 16, 20);

  const handleCategorySelect = async (category: string) => {
    console.log('🔍 Debugging channel lookup:');
    console.log('- cid from useActiveChatStore:', cid);
    console.log('- channels from useStreamChatStore:', channels.length);
    console.log('- passed channel:', passedChannel);
    console.log('- channel found:', channel);
    
    // Use the passed channel's cid as fallback if useActiveChatStore cid is null
    const effectiveCid = cid || passedChannel?.cid || channel?.cid;
    
    if (!effectiveCid) {
      Alert.alert('Fehler', 'Channel ID nicht verfügbar');
      return;
    }
    
    if (!channel) {
      console.error('❌ Channel nicht gefunden für cid:', effectiveCid);
      console.log('Verfügbare channels:', channels.map(ch => ({ cid: ch.cid, id: ch.channel_id })));
      Alert.alert('Fehler', 'Channel nicht gefunden. Bitte versuchen Sie es erneut.');
      return;
    }

    try {
      console.log('🔄 Starting category update for cid:', effectiveCid, 'category:', category);
      const db = useSQLiteContext();
      
      // Check if table exists before proceeding
      const tableCheck = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='channels_fetched'"
      );
      console.log('📊 Table check result:', tableCheck);
      
      await adjustCategory(db, category, effectiveCid);
      
      // Update the channel in the store
      const updatedChannels = channels.map(ch => 
        ch.cid === effectiveCid 
          ? { ...ch, custom_post_category_choosen: category }
          : ch
      );
      
      // Update the store
      useStreamChatStore.getState().setChannels(updatedChannels);
      
      setSelectedCategory(category);
      setCategoryModalVisible(false);
      
      console.log('✅ Kategorie erfolgreich aktualisiert:', category);
    } catch (error) {
      console.error('❌ Fehler beim Aktualisieren der Kategorie:', error);
      Alert.alert('Fehler', 'Kategorie konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.');
    }
  };

  const CategorySelectionModal = () => (
    <Modal
      visible={categoryModalVisible}
      animationType="fade"
      transparent
      onRequestClose={() => setCategoryModalVisible(false)}
    >
      <Pressable 
        style={categoryModalStyles.overlay} 
        onPress={() => setCategoryModalVisible(false)}
      >
        <View style={categoryModalStyles.modalContent}>
          <Text style={[categoryModalStyles.title, { fontSize: adjustedFontSize + 4 }]}>
            Kategorie auswählen
          </Text>
          
          <View style={categoryModalStyles.categoriesGrid}>
            {Object.entries(categoryIcons).map(([key, icon]) => (
              <TouchableOpacity
                key={key}
                style={[
                  categoryModalStyles.categoryItem,
                  currentCategory === key && categoryModalStyles.selectedCategory
                ]}
                onPress={() => handleCategorySelect(key)}
              >
                <Image source={icon as any} style={categoryModalStyles.categoryIcon} />
                <Text style={[
                  categoryModalStyles.categoryLabel, 
                  { fontSize: adjustedFontSize },
                  currentCategory === key && categoryModalStyles.selectedCategoryText
                ]}>
                  {categoryLabels[key as keyof typeof categoryLabels]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={categoryModalStyles.cancelButton}
            onPress={() => setCategoryModalVisible(false)}
          >
            <Text style={[categoryModalStyles.cancelText, { fontSize: adjustedFontSize }]}>
              Abbrechen
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back-circle-outline" size={36} color="#333" />
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <View style={styles.imagesRow}>
          <Image source={{ uri: user?.profileImageUrl }} style={styles.profileImage} />
          <Image source={{ uri: otherUserImage }} style={[styles.profileImage, { marginLeft: -10 }]} />
        </View>
        <Text style={styles.namesText} numberOfLines={1}>
          {otherUserName}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => {
          if (!channel) {
            Alert.alert('Hinweis', 'Channel-Daten werden noch geladen. Bitte warten Sie einen Moment.');
            return;
          }
          setCategoryModalVisible(true);
        }}
      >
        {categoryIcon && (
          <Image source={categoryIcon as any} style={styles.icon} />
        )}
        <View style={styles.editIndicator}>
          <Ionicons name="pencil" size={8} color="#666" />
        </View>
      </TouchableOpacity>
      
      <View style={styles.menuContainer}>
        <NachrichtenMenu iconSize={40} iconColor="#333" />
        <Text style={styles.menuHint}>⋯</Text>
      </View>

      <CategorySelectionModal />
    </View>
  );
};

const categoryModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
    maxWidth: 400,
  },
  title: {
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryItem: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9a00',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  categoryLabel: {
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#ff9a00',
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
  cancelText: {
    color: '#666',
    fontWeight: '500',
  },
});

export default CustomChatHeader;