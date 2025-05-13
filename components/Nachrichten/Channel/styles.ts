import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    outerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    leftActionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'red',
      borderWidth: 1,
  
    },
    leftActionInnerContainer: {
      backgroundColor: 'red',
      borderWidth: 1,
    },
  
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      alignItems: 'center',
    },
    leftContainer: {
      marginRight: 10,
    },
    avatarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      borderRadius: 25,
    },
    iconsContainer: {
      marginLeft: 5,
    },
    icon: {
  
      marginVertical: 2,
      borderRadius: 25,
    },
    middleContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    channelName: {
      fontWeight: 'bold',
    },
    lastMessage: {
      color: '#555',
      marginTop: 2,
    },
    rightContainer: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    date: {
      color: '#999',
    },
    unreadBadge: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
    },
    unreadText: {
      color: 'white',
      fontWeight: 'bold',
      paddingHorizontal: 5,
    },
  });