import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const onboardingSharedStyles = StyleSheet.create({
  // Layout
  mainContainer: {
    flex: 1,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  topSection: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    position: 'relative',
  },
  beeAnimation: {
    position: 'absolute',
    top: 16,
    left: 120,
    transform: [{ translateX: -40 }],
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: 'white',
    transform: [{ scale: 1.2 }],
  },
  headerSection: {
    paddingHorizontal: 20,
   
    marginTop: 10,
  },
  headerCard: {
    borderRadius: 12,
    padding: 20,
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    fontSize: 32,
    marginBottom: 8,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    flex: 1,
    marginBottom: 20,
  },
  fieldsContainer: {
    flexGrow: 0,
  },
  formCard: {
    borderRadius: 25,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },

  // Navigation
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    padding: 8,
  },

  // Form Elements
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 236, 239, 0.6)',
  },
  infoButtonText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  requiredStar: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(233, 236, 239, 0.8)',
    color: '#333',
    borderRadius: 12,
  },
  inputFocused: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  inputError: {
    borderColor: '#f44336',
    backgroundColor: '#fff5f5',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
  },
  errorText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#f44336',
  },

  // Buttons
  nextButton: {
    marginTop: 20,
    borderRadius: 18,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  nextButtonText: {
    fontWeight: 'bold',
    color: 'white',
    marginRight: 6,
    fontSize: 24,
  },

  // Address Auto-fill
  autoFillContainer: {
    marginBottom: 16,
  },
  autoFillButton: {
    backgroundColor: 'rgb(255, 180, 30)',
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 12,
  },
  modalText: {
    fontSize: 22,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
});

// Responsive utility functions
export const getResponsiveSize = (baseSize: number, screenWidth: number, multiplier: number = 0.04) => {
  return Math.max(baseSize, screenWidth * multiplier);
};

export const getResponsivePadding = (screenWidth: number, multiplier: number = 0.05) => {
  return screenWidth * multiplier;
};

export const getResponsiveMargin = (screenHeight: number, multiplier: number = 0.02) => {
  return screenHeight * multiplier;
}; 