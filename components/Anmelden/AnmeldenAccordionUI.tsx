// components/Anmelden/AnmeldenAccordionUI.tsx

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface InputField {
  icon: string;
  placeholder: string;
  value: string;
  editable: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
}

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  accordionTitle: string;
  inputFields: InputField[];
  isOnboarding?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

const AnmeldenAccordionUI = ({
  isExpanded,
  onToggle,
  accordionTitle,
  inputFields,
  isOnboarding = false,
  isSaving = false,
  onSave,
  isEditing = false,
  onEdit,
  onCancel,
}: Props) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle} style={styles.header}>
        <Text style={styles.title}>{accordionTitle}</Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <Ionicons name="chevron-down" size={24} color="#666" />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {inputFields.map((field, index) => (
            <View key={index} style={styles.inputRow}>
              <Ionicons name={field.icon as any} size={24} color="#666" style={styles.icon} />
              <TextInput
                style={[styles.input, !field.editable && styles.inputDisabled]}
                placeholder={field.placeholder}
                value={field.value}
                onChangeText={field.onChangeText}
                editable={field.editable}
                keyboardType={field.keyboardType}
                placeholderTextColor="#999"
              />
            </View>
          ))}

          {!isOnboarding && (
            <View style={styles.buttonContainer}>
              {!isEditing ? (
                <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                  <LinearGradient
                    colors={['#FF9F43', '#FFA726', '#FFB74D']}
                    style={styles.gradientButton}
                    start={{ x: 0.1, y: 0.1 }}
                    end={{ x: 0.5, y: 1 }}
                  >
                    <Text style={styles.buttonText}>Bearbeiten</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity onPress={onSave} style={styles.saveButton} disabled={isSaving}>
                    <LinearGradient
                      colors={['#4CAF50', '#45a049']}
                      style={styles.gradientButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.buttonText}>
                        {isSaving ? 'Speichern...' : 'Speichern'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                    <LinearGradient
                      colors={['#F44336', '#e53935']}
                      style={styles.gradientButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.buttonText}>Abbrechen</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    minWidth: '100%',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 18,
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  editButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  cancelButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 20,
  },
});

export default AnmeldenAccordionUI;