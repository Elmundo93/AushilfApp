// components/Nachrichten/NachrichtenMenu.tsx
import React, { useContext, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

const NachrichtenMenu: React.FC<{ iconSize?: number; iconColor?: string }> = ({
  iconSize = 24,
  iconColor = 'black',
}) => {
  const { fontSize } = useContext(FontSizeContext);
  const [visible, setVisible] = useState(false);

  const maxFontSize = 28;
  const defaultFontSize = 24;
  const componentBaseFontSize = 22;

  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const handleWriteMessage = () => {
    setVisible(false);
    alert('Nachricht schreiben');
  };

  const handleBlockUser = () => {
    setVisible(false);
    alert('Benutzer blockieren');
  };

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menuBox}>
            <TouchableOpacity style={styles.menuItem} onPress={handleWriteMessage}>
              <Text style={[styles.menuText, { fontSize: finalFontSize }]}>Nachricht schreiben</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleBlockUser}>
              <Text style={[styles.menuText, { fontSize: finalFontSize }]}>Benutzer blockieren</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.blockDanger]}
              onPress={handleBlockUser}
            >
              <Text style={styles.blockDangerText}>Benutzer blockieren (streng)</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 75,
    paddingRight: 10,
  },
  menuBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  menuText: {
    fontWeight: '500',
    color: '#222',
  },
  blockDanger: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  blockDangerText: {
    backgroundColor: 'red',
    color: 'white',
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
});

export default React.memo(NachrichtenMenu);