// components/styles/onboardingStyles.ts
import { StyleSheet, Platform, ViewStyle } from 'react-native';


export const getLottieStyle = (stepIndex: number): ViewStyle => {
    const leftOffsets = [100, 130, 140, 160, 180]; // Abstufung je nach Step
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
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
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
  topContainer: {
    paddingTop: 20,
    marginTop: 30,
  },
  lottie: {
    position: 'absolute',
    top: -50,
    right: 0,
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: 'white',
    transform: [{ scale: 1.2 }],
  },
  titleCard: {
    padding: 25,
    borderRadius: 25,
    shadowColor: '#000',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 10,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    marginTop: -40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 50,
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
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: '#ffa500',
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
  text: {
    fontSize: 22,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  categoryButton: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default onboardingStyles;