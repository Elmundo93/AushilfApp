import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  profileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countCard: {
    marginLeft: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  countNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  countLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  profileInfo: {
    marginTop: 20,
  },
  bioWrapper: {
    marginTop: 10,
  },
  bioInput: {
    fontSize: 14,
    color: '#333',
    padding: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 40,
  },
  bioText: {
    fontSize: 14,
    color: '#444',
  },
  danksagungsCount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },

  
  
  userBioTitle: {
    position: 'absolute',
    top: -18,
    left: 10,
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 6,
  },
  
  trenner: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    opacity: 0.5,
  },
  userBioContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    padding: 16,
    marginVertical: 16,
    marginTop: 25,
  },
 
  userBio: {
    fontSize: 16,
  },
  userBioInput: {
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editBioButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  editBioButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editBioText: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  danksagungenHeader: {
    marginTop: 20,
    marginBottom: 8,
  },
  danksagungenTitle: {
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
