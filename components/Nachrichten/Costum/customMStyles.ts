import { StyleSheet } from 'react-native';



export const styles = StyleSheet.create({
    messageRow: {
      flexDirection: 'row',
      marginVertical: 6,
      paddingHorizontal: 10,
      alignItems: 'flex-end',
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 4,
    },
    time: {
      fontSize: 10,
      color: 'gray',
    },
    ownRow: {
      justifyContent: 'flex-end',
    },
    otherRow: {
      justifyContent: 'flex-start',
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      marginRight: 8,
    },
    bubble: {
      maxWidth: '75%',
      borderRadius: 16,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    ownBubble: {
      backgroundColor: '#FFE2B4',
      borderTopRightRadius: 0,
    },
    otherBubble: {
      backgroundColor: '#F0F0F0',
      borderTopLeftRadius: 0,
    },
    username: {
      fontWeight: '600',
      marginBottom: 2,
      color: '#555',
    },
    text: {
      color: '#000',
    },
  });