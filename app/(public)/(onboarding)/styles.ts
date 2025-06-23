// components/styles/onboardingStyles.ts
import { StyleSheet, Platform, ViewStyle } from 'react-native';

export const getLottieStyle = (stepIndex: number): ViewStyle => {
    const leftOffsets = [90, 117, 140, 145, 180,185]; // Abstufung je nach Step
    return {
      position: 'absolute',
      top: -50,
      left: leftOffsets[stepIndex] ?? 130, // fallback
      width: 120,
      height: 120,
      alignSelf: 'center',
    };
  };

export const onboardingStyles = StyleSheet.create({
  activeDot: {
    backgroundColor: 'white',
    transform: [{ scale: 1.2 }],
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  avatarSelected: {
    borderColor: '#ffa500',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 20,
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 25,
    borderRadius: 25,
    elevation: 5,
    marginTop: 50,
  },
  categoryButton: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'center',

    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    marginTop: -40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  imageButton: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginVertical: 5,
  },
  inputLabel: {
    position: 'absolute',
    top: -15,
    left: 10,
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'white',
    zIndex: 10,
  },
  lottie: {
    position: 'absolute',
    top: -50,
    right: 0,
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#555',
    fontSize: 16,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'grey',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    gap: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '500',

    textAlign: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'center',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 15,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    height: 180,
    fontSize: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    alignSelf: 'center',
   


  },
  titleCard: {
    padding: 25,
    borderRadius: 25,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    paddingTop: 20,
    marginTop: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 10,
    gap: 6,
  },
  infoButtonText: {
    fontSize: 14,
    color: '#333',
  },
});

export default onboardingStyles;