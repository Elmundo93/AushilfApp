import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { onboardingSharedStyles, getResponsiveSize, getResponsivePadding, getResponsiveMargin } from '@/app/(public)/(onboarding)/sharedStyles';

interface FormField {
  label: string;
  key: string;
  placeholder: string;
  keyboardType?: string;
  textContentType?: string;
  autoComplete?: string;
  icon: string;
  required: boolean;
}

interface OnboardingFormProps {
  fields: FormField[];
  formData: any;
  onFieldChange: (key: string, value: string) => void;
  focusedField: string | null;
  onFieldFocus: (key: string) => void;
  onFieldBlur: () => void;
  onNext: () => void;
  nextButtonText?: string;
  showInfoButton?: boolean;
  onInfoPress?: () => void;
  infoButtonText?: string;
  errorField?: string;
  errorMessage?: string;
  shakeAnimation?: Animated.Value;
  extraContent?: React.ReactNode;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  fields,
  formData,
  onFieldChange,
  focusedField,
  onFieldFocus,
  onFieldBlur,
  onNext,
  nextButtonText = 'Weiter',
  showInfoButton = true,
  onInfoPress,
  infoButtonText = 'Datenschutzinfo',
  errorField,
  errorMessage,
  shakeAnimation,
  extraContent,
}) => {
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  return (
    <View style={onboardingSharedStyles.formSection}>
      <BlurView 
        intensity={100} 
        tint="light" 
        style={[
          onboardingSharedStyles.formCard, 
          { 
            padding: getResponsivePadding(screenWidth), 
            borderRadius: 25 
          }
        ]}
      >
        {showInfoButton && onInfoPress && (
          <TouchableOpacity
            style={[
              onboardingSharedStyles.infoButton, 
              { padding: getResponsivePadding(screenWidth, 0.03) }
            ]}
            onPress={onInfoPress}
          >
            <Ionicons 
              name="shield-checkmark-outline" 
              size={getResponsiveSize(16, screenWidth, 0.045)} 
              color="#4CAF50" 
            />
            <Text style={[
              onboardingSharedStyles.infoButtonText, 
              { fontSize: getResponsiveSize(12, screenWidth, 0.035) }
            ]}>
              {infoButtonText}
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={getResponsiveSize(12, screenWidth, 0.035)} 
              color="#666" 
            />
          </TouchableOpacity>
        )}

        {extraContent}

        <View style={onboardingSharedStyles.fieldsContainer}>
          {fields.map(({ label, key, placeholder, keyboardType = 'default', textContentType, autoComplete, icon, required }) => (
            <Animated.View 
              key={key} 
              style={[
                onboardingSharedStyles.inputContainer,
                key === errorField && shakeAnimation ? { 
                  transform: [{ translateX: shakeAnimation }] 
                } : null
              ]}
            >
              <View style={onboardingSharedStyles.inputHeader}>
                <Ionicons 
                  name={icon as any} 
                  size={getResponsiveSize(14, screenWidth, 0.04)} 
                  color="#666" 
                  style={onboardingSharedStyles.inputIcon} 
                />
                <Text style={[
                  onboardingSharedStyles.inputLabel, 
                  { fontSize: getResponsiveSize(14, screenWidth, 0.04) }
                ]}>
                  {label}
                  {required && <Text style={onboardingSharedStyles.requiredStar}> *</Text>}
                </Text>
              </View>
              <TextInput
                style={[
                  onboardingSharedStyles.input,
                  { 
                    padding: getResponsivePadding(screenWidth, 0.03),
                    fontSize: getResponsiveSize(14, screenWidth, 0.04),
                  },
                  focusedField === key && onboardingSharedStyles.inputFocused,
                  key === errorField ? onboardingSharedStyles.inputError : null,
                ]}
                placeholder={placeholder}
                placeholderTextColor="#999"
                keyboardType={keyboardType as any}
                value={formData[key] || ''}
                onChangeText={(text) => onFieldChange(key, text)}
                onFocus={() => onFieldFocus(key)}
                onBlur={onFieldBlur}
                textContentType={textContentType as any}
                autoComplete={autoComplete as any}
                importantForAutofill="yes"
                autoCapitalize="none"
                returnKeyType="next"
              />
              {key === errorField && errorMessage && (
                <View style={onboardingSharedStyles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={14} color="#f44336" />
                  <Text style={onboardingSharedStyles.errorText}>{errorMessage}</Text>
                </View>
              )}
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity 
          style={[
            onboardingSharedStyles.nextButton, 
            { marginTop: getResponsiveMargin(screenHeight) }
          ]} 
          onPress={onNext}
        >
          <LinearGradient
            colors={['#FFB41E', '#FF9900']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              onboardingSharedStyles.gradientButton, 
              { padding: getResponsiveMargin(screenHeight) }
            ]}
          >
            <Text style={[
              onboardingSharedStyles.nextButtonText, 
              { fontSize: getResponsiveSize(14, screenWidth, 0.04) }
            ]}>
              {nextButtonText}
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={getResponsiveSize(16, screenWidth, 0.045)} 
              color="white" 
            />
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}; 