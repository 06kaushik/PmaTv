import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, Image, NativeEventEmitter, NativeModules, Alert, StyleSheet } from 'react-native'
import { COLORS } from "../components/GlobalStyle";
import { Useorientation } from "../components/UseContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from "@react-navigation/native";




const OrientationScreen1 = ({ navigation }) => {
    const { setOrientationPreference } = Useorientation();
    const [orientation, setOrientation] = useState('')

    const getOrient = async () => {
        const resp = await AsyncStorage.getItem('orientationPreference')
        console.log('resppkmmseee', resp);
        setOrientation(resp)
    }

    useEffect(() => {
        getOrient()
    }, [])

    const port = require('../assests/portrait.png')
    const land = require('../assests/landscape.png')

    const handleInput1Focus = () => {
        inputRef1.current.focus();
        setFocusedButtonIndex(2);
    };

    const [focusedButtonIndex, setFocusedButtonIndex] = useState(2);
    // console.log('value changeeee', focusedButtonIndex);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

    let focusButton = 2

    let nextIndex = focusButton;


    const handleKeyPress = (keycode) => {

        switch (keycode) {
            case 19:
                console.log("Left button pressed");
                setFocusedButtonIndex(2)
                break;
            case 20:
                break;
            case 23:
                console.log("Enter button pressed");
                handleButtonPress(focusedButtonIndex);
                break;
            default:
                break;
        }
    }

    const handleButtonPress = useCallback(
        (buttonIndex) => {
            console.log('button index', buttonIndex);
            setSelectedButtonIndex(buttonIndex);

            switch (buttonIndex) {
                case 2:
                    // Navigate to camera screen
                    setOrientationPreference(orientation === 'portrait' ? 'landscape' : 'portrait')
                    break;
                default:
                    break;
            }
        },
        [navigation]
    );

    useFocusEffect(
        useCallback(() => {
            // setFocusedButtonIndex(focusedButtonIndex); // Reset focus when the screen gains focus
        }, [])
    );

    const renderButton = (index, label, imageSource) => {
        // console.log('indexxxx', index);
        const isFocused = index === focusedButtonIndex;
        const isSelected = index === selectedButtonIndex;
        const buttonStyle = [
            styles.button,
            isFocused ? styles.focusedButton : null,
            // isSelected && styles.selectedButton,
        ];
        const textStyle = [
            styles.buttonText,
            isFocused ? styles.focusedButtonText : null,
            isSelected && styles.selectedButtonText,

        ];


        return (
            <TouchableOpacity
                // key={index}
                style={buttonStyle}
                onPress={() => { handleButtonPress(index) || setOrientationPreference(orientation === 'portrait' ? 'landscape' : 'portrait') }}
            >
                <View style={{ flexDirection: 'row', marginLeft: 16 }}>
                    <Image source={imageSource} style={styles.buttonImage} />
                    <Text style={textStyle}>{label}</Text>
                </View>
            </TouchableOpacity>
        );
    };



    useEffect(() => {
        const keyEventModule = NativeModules.KeyEventEmitter;
        const eventEmitter = new NativeEventEmitter(keyEventModule);



        const keyEventSubscription = eventEmitter.addListener('onKeyDown', (event) => {
            console.log('Key pressed:', event.keyCode);
            console.log('Event:', event); // Log the entire event object
            handleKeyPress(event.keyCode);
        });

        return () => {
            keyEventSubscription.remove();
        };
    }, []);

    return (
        <View style={{ backgroundColor: COLORS.background }}>

            <View style={{ backgroundColor: COLORS.background, transform: [{ rotate: '90deg' }], height: '100%', width: '100%' }}>
                <View style={{ marginTop: 40, marginLeft: 16, marginRight: 16, alignSelf: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, bottom: 190 }}>Change Orientation</Text>
                </View>

                <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onFocus={handleInput1Focus} onPress={() => setOrientationPreference(orientation === 'portrait' ? 'landscape' : 'portrait')
                    }>
                        {renderButton(2, orientation === 'portrait' ? 'Landscape Mode' : 'Portrait Mode', orientation === 'portrait' ? land : port)}
                    </TouchableOpacity>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Current Orientation : {orientation}</Text>
                </View>
            </View>

        </View>

    )

}

export default OrientationScreen1

const styles = StyleSheet.create({
    button: {
        height: 130,
        width: 120,
        // paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "#303749",
        borderColor: "black",
        // left: 10,
        // right: 10

    },

    buttonText: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
        marginLeft: 8
        // bottom: 70
    },

    focusedButton: {
        backgroundColor: "#303749",
        height: 80,
        width: 290,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#D6C2FF',
        bottom: 5
    },

    selectedButtonText: {
        color: "white",
    },

    buttonImage: {
        width: 65,
        height: 65,
        alignSelf: 'center',
        tintColor: 'white',
        bottom: 3
    },

    focusedButtonText: {
        top: 10
    },
})