// styles.ts
import { createRStyle } from 'react-native-full-responsive';

export const styles = createRStyle({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
  trenner: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    opacity: 0.5,
    width: '320rs',
  },
  trenner2: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    opacity: 0.5,
    width: '300rs',
    alignSelf: 'center',
  },
  userInfoCard: {
    padding: 16,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'center',
  },
  userBioContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    padding: 16,
    marginVertical: 16,
  },
  userBioTitle: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 8,
    position: 'absolute',
    top: -18,
    left: 15,
    backgroundColor: 'white',
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
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
  lottieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  lottie: {
    alignSelf: 'center',
    width: 100,
    height: 80,
    zIndex: 100,
    transform: [{ rotate: '180deg' }],
    color: 'green',
  },
  danksagungList: {
    flex: 1,
  },
  danksagungCard: {
    padding: 16,
    marginBottom: 8,
  },
  danksagungText: {
    fontSize: 16,
    marginBottom: 4,
  },
  danksagungAuthor: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  header: {
    marginBottom: 20,
  },
  danksagungenHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  gradientHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170, // Anpassen Sie diese Höhe nach Bedarf

  },
  
  gradient: {
    flex: 1,
  },
  

  danksagungenTitle: {

    fontWeight: 'bold',
    color: 'orange',

    letterSpacing: 2,
  },
  emptyListContainer: {
   
    borderRadius: 25,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignContent: 'center',
    margin: 25,
    padding: 20,
  },
  emptyListText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    textAlign: 'center',
  },
});