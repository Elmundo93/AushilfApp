import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import { View, Text } from 'react-native';
import React from 'react'
import { TextInput } from 'react-native';
import { useState } from 'react';
import  CheckBox  from 'expo-checkbox';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';

const PostMeldenPage: React.FC = () => { 

    const { fontSize, setFontSize } = useContext(FontSizeContext);
    const maxFontSize = 38; // Passen Sie diesen Wert nach Bedarf an
    const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
    const componentBaseFontSize = 24; // Ausgangsschriftgröße für das Label
    const minIconSize = 35;
    const maxIconSize = 60;
    const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  
    // Berechnung der angepassten Schriftgröße
    const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  
    const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
    const [rassistischeHetze, setRassistischeHetze] = useState(false);
    const [sexuellAnzüglich, setSexuellAnzüglich] = useState(false);
    const [spam, setSpam] = useState(false);
    const [mobbing, setMobbing] = useState(false);
    const [verletzungDerPrivatsphäre, setVerletzungDerPrivatsphäre] = useState(false);
    const [andereGründe, setAndereGründe] = useState('');

    return (
        <View style={styles.Container}>
            <View style={styles.CheckboxContainer}>
            <View style={styles.Checkbox}>
                <CheckBox value={false} />
            <Text style={{ fontSize: finalFontSize }}>Rassistische Hetze</Text>
            </View>
            <View style={styles.trenner} />
            <View style={styles.Checkbox}>
                <CheckBox value={false} />
            <Text style={{ fontSize: finalFontSize }}>Sexuell anzüglich</Text>
            </View>
            <View style={styles.trenner} />
            <View style={styles.Checkbox}>
                <CheckBox value={false} />
            <Text style={{ fontSize: finalFontSize }}>Spam</Text>
            </View>
            <View style={styles.trenner} />
                <View style={styles.Checkbox}>
                <CheckBox value={false} />
            <Text style={{ fontSize: finalFontSize }}>Mobbing</Text>
            </View>
            <View style={styles.trenner} />
                <View style={styles.Checkbox}>
                <CheckBox value={false} />
            <Text style={{ fontSize: finalFontSize }}>Verletzung der Privatsphäre</Text>
            </View>
            </View>
            <View style={styles.secondContainer}>
            <View style={styles.TextInputContainer}>
            <TextInput placeholder='Andere Gründe' style={[styles.TextInput, { fontSize: finalFontSize }]} multiline={true} numberOfLines={4} textAlignVertical='top'                                   />
            </View>
            <View>
                <Text style={{ fontSize: finalFontSize }}>Der Post wird durch's Melden erstmal entfernt und geprüft.</Text>
                <Text style={{ fontSize: finalFontSize }}>Bitte beachte, dass unrechtmäßiges Melden eines Posts auch konsequenzen haben kann!</Text>
            </View>
            </View>
            <View style={styles.ButtonContainer}>
                <TouchableOpacity style={styles.Button}>
                    <Text style={[styles.ButtonText, { fontSize: finalFontSize }]}>Post melden</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: 'white',
    },
    CheckboxContainer: {

        flexDirection: 'column',
        marginVertical: 10,
        width: '80%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        
    },
    trenner: {
        borderWidth: 1,
        borderColor: 'lightgray',
        marginVertical: 5,
    },
    Checkbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    secondContainer: {
        flexDirection: 'column',
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
    },
    TextInputContainer: {
        marginBottom: 10,
    },
    TextInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        minHeight: 100,
        maxHeight: 200,
    },
    ButtonContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
    },
    Button: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    ButtonText: {
        color: 'white',

    }
});
export default PostMeldenPage;