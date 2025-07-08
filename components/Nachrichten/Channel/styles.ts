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
      backgroundColor: '#FFA500',
      borderRadius: 10,
      minWidth: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 3,
      shadowColor: '#FFA500',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 2,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    unreadText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 10,
      paddingHorizontal: 3,
      textAlign: 'center',
    },
  });