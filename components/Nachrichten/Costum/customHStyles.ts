import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  backButton: {
    padding: 6,
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
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
  },
  menuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  menuHint: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});