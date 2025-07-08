import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onboardingSharedStyles } from '@/app/(public)/(onboarding)/sharedStyles';

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
  buttonText?: string;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  visible,
  onClose,
  title,
  content,
  buttonText = 'Verstanden',
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={onboardingSharedStyles.modalOverlay}>
        <View style={onboardingSharedStyles.modalContent}>
          <View style={onboardingSharedStyles.modalHeader}>
            <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
            <Text style={onboardingSharedStyles.modalTitle}>{title}</Text>
          </View>
          <Text style={onboardingSharedStyles.modalText}>
            {content}
          </Text>
          <TouchableOpacity
            style={onboardingSharedStyles.modalButton}
            onPress={onClose}
          >
            <Text style={onboardingSharedStyles.modalButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}; 