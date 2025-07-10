import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 6,
    position: 'absolute',
    left: 12,
    zIndex: 10,
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  namesText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
    textAlign: 'center',
  },
  menuContainer: {
    position: 'absolute',
    right: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 88,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  

  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  editIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  menuHint: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});