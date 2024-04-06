import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, PermissionsAndroid, BackHandler } from 'react-native'
import { COLORS } from "../components/GlobalStyle";
import { RNCamera } from "react-native-camera";




const CameraScreen1 = ({ navigation }) => {

    const cameraRef = useRef(null)
    console.log('CAMERAAAAAA REF', cameraRef);
    const [takingPic, setTakingPic] = useState(false)

    // useEffect(() => {
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    //     return () => backHandler.remove();
    // }, []);

    // const handleBackPress = () => {
    //     navigation.navigate('Settings1');
    //     return true; // Return true to prevent the default back button action
    // };



    return (
        <View style={{ backgroundColor: COLORS.background }}>
            <View style={{ height: '100%', width: '100%', backgroundColor: COLORS.background, transform: [{ rotate: '90deg' }] }}>
                <View style={{ marginTop: 40, marginLeft: 16, marginRight: 16, alignSelf: 'center' }}>

                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, alignSelf: 'center', bottom: 190 }}>Camera Setup</Text>

                </View>

                <View style={{ alignSelf: 'center', marginTop: 60, transform: [{ rotate: '90deg' }] }}>

                    <RNCamera
                        ref={cameraRef}
                        type={'front'}
                        style={{ height: 340, width: 413, flex: 1 }}
                        orientation={'portrait'}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    />
                </View>

            </View>
        </View>

    )
}

export default CameraScreen1