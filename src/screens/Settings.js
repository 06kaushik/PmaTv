import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, NativeEventEmitter, NativeModules, Platform, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ContextApi } from "../components/ContextApi";
import { COLORS } from "../components/GlobalStyle";
import QRCode from "react-native-qrcode-svg";
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs'
import RNFetchBlob from "rn-fetch-blob";
import axios from "axios";



const SettingScreen = ({ route }) => {
    const navigation = useNavigation();
    const [focusedButtonIndex, setFocusedButtonIndex] = useState(1);
    const { logout } = useContext(ContextApi)
    console.log('focus index button', focusedButtonIndex);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
    console.log('selected button inex', selectedButtonIndex);
    const { uniqueId } = route.params
    const appVersion = DeviceInfo.getVersion();
    console.log('app version', appVersion);
    const [uniqueIdd, setUniqueIdd] = useState('')
    const [orientation, setOrientation] = useState('')
    const [update, setUpdate] = useState(false)
    const [progress, setProgress] = useState(0);
    const [check, setCheck] = useState('')





    const folderPath = RNFS.DownloadDirectoryPath + '/DeviceData'
    const apkFolder = folderPath + '/apk'

    const compareVersion = () => {
        if (check === appVersion) {
            console.log('compareeee', check === appVersion);
            setUpdate(false)
        } else {
            setUpdate(true)
        }
    }
    useEffect(() => {
        compareVersion()
    }, [check])

    const getOrient = async () => {
        const resp = await AsyncStorage.getItem('orientationPreference')
        console.log('resppkmmseee', resp);
        setOrientation(resp)
    }

    useEffect(() => {
        getOrient()
    }, [])


    const requestId = async () => {
        const deviceId = await DeviceInfo.getUniqueId()
        setUniqueIdd(deviceId)
    }

    useEffect(() => {
        requestId()
    }, [])



    const handleButtonPress = useCallback(
        (buttonIndex) => {
            console.log('button index', buttonIndex);
            setSelectedButtonIndex(buttonIndex);

            switch (buttonIndex) {
                case 1:
                    // Navigate to camera screen
                    navigation.navigate("Camera");
                    break;
                case 2:
                    // Navigate to screen 2
                    navigation.navigate('OrientationPort')
                    break;
                case 3:
                    // Navigate to screen 3
                    navigation.navigate('Contact')
                    break;
                case 4:
                    // Navigate to screen 4
                    navigation.navigate('Privacy')
                    break;
                case 5:
                    // Navigate to screen 4
                    navigation.navigate('Terms')
                    break;
                case 6:
                    // Navigate to screen 4
                    showConfirmDialog(null, check);
                    break;
                case 7:
                    logout()

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

    var prevIndex = 1

    const handleKeyPress = (keycode) => {

        switch (keycode) {
            case 21:
                console.log("Left button pressed");
                // setFocusedButtonIndex((prevIndex) =>
                //     prevIndex === 1 ? 6 : prevIndex - 1
                // );
                prevIndex = prevIndex - 1
                setFocusedButtonIndex(prevIndex)
                break;
            case 22:
                console.log("Right button pressed");
                // setFocusedButtonIndex((prevIndex) =>
                //     prevIndex === 6 ? 1 : prevIndex + 1
                // );
                prevIndex = prevIndex + 1
                setFocusedButtonIndex(prevIndex)
                break;
            case 23:
                // console.log("Enter button pressed", focusedButtonIndex);
                // handleButtonPress(focusedButtonIndex);
                break;
            default:
                break;
        }
    }


    const renderButton = (index, label, imageSource) => {
        console.log('indexxxx', index);
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
        const buttonStyle1 = [
            styles.button1,
            isFocused ? styles.focusedButton1 : null,
            isSelected && styles.selectedButton1,
        ];
        const textStyle1 = [
            styles.buttonText1,
            isFocused ? styles.focusedButtonText1 : null,
            isSelected && styles.selectedButtonText1,

        ];
        const buttonStyle2 = [
            styles.button2,
            isFocused ? styles.focusedButton2 : null,
            // isSelected && styles.selectedButton1,
        ];


        return (

            <TouchableOpacity
                // key={index}
                style={index === 7 ? buttonStyle1 : index === 6 && update === true ? buttonStyle2 : buttonStyle}
                onPress={() => handleButtonPress(focusedButtonIndex)}
            >
                <Image source={imageSource} style={styles.buttonImage} />
                <Text style={index === 7 && 6 ? textStyle1 : textStyle}>{label}</Text>
            </TouchableOpacity>
        );
    };
    const renderButtonn = (index, label, imageSource) => {
        console.log('indexxxx', index);
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
        const buttonStyle1 = [
            styles.button1,
            isFocused ? styles.focusedButton1 : null,
            isSelected && styles.selectedButton1,
        ];
        const textStyle1 = [
            styles.buttonText1,
            isFocused ? styles.focusedButtonText1 : null,
            isSelected && styles.selectedButtonText1,

        ];

        const buttonStyle2 = [
            styles.button2,
            isFocused ? styles.focusedButton2 : null,
            // isSelected && styles.selectedButton1,
        ];


        return (

            <TouchableOpacity
                // key={index}
                style={index === 7 ? buttonStyle1 : index === 6 && update === true ? buttonStyle2 : buttonStyle}
                onPress={() => handleButtonPress(index)}
            >
                <Image source={imageSource} style={styles.buttonImage} />
                <Text style={index === 7 ? textStyle1 : textStyle}>{label}</Text>
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

    const [platformHeader, setPlatformHeader] = useState('')


    const getPlatform = () => {
        const isTV =
            Platform.OS === 'android' &&
            Platform.isTV === true;
        setPlatformHeader(isTV)

    }
    useEffect(() => {
        getPlatform()
    }, [])


    const checkVersionApk = async () => {
        try {
            const resp = await axios.get('/api/apk/getAllVersion')
            // console.log('all version of APK', resp?.data?.data[0]?.version);
            setCheck(resp?.data?.data[0]?.version)

        } catch (error) {
            console.log('error from apk', error);

        }
    }

    useEffect(() => {
        checkVersionApk()

    }, [])

    const showConfirmDialog = (item, check) => {
        return Alert.alert(
            "UPDATE?",
            `Are you sure you want to UPDATE ?`,
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: () => {
                        checkVersionApk().then(() => {

                            checkUpdate(check);
                        })
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    };

    const checkUpdate = async () => {

        try {
            const resp = await axios.get(`/api/apk/getApkByVersion/${check}`)
            // console.log('check UPDATEEEEEE ', resp?.data?.data?.contentLink);
            downloadNewVersion(resp?.data?.data?.contentLink)

        } catch (error) {
            console.log('errr from check update', error);

        }
    }



    const downloadNewVersion = async (contentLink) => {
        const s3DownloadUrl = contentLink
        const downloadDest = RNFS.DownloadDirectoryPath + '/DeviceData' + '/apk' + '/pmaplus.apk'

        try {
            // Check if the file already exists in the download directory
            const fileExists = await RNFetchBlob.fs.exists(downloadDest);

            if (fileExists) {
                // Delete the existing file before downloading the new version
                await RNFetchBlob.fs.unlink(downloadDest);
                console.log('Existing file deleted:', downloadDest);
            }

            // Download the new app version
            await RNFetchBlob.config({
                path: downloadDest,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: downloadDest,
                    mime: 'application/vnd.android.package-archive',
                    title: 'New App Version',
                    description: 'Downloading new app version...',
                    mediaScannable: true,
                },
                indicator: true,
            })
                .fetch('GET', s3DownloadUrl)
                .progress((received, total) => {
                    const newProgress = Math.floor((received / total) * 100);
                    setProgress(newProgress);
                });
            console.log('App download complete');

            Alert.alert(
                'Download Complete',
                'The new app version has been downloaded successfully.Please Go To DeviceData inside Download Folder To Install Latest App.',
                [
                    {
                        text: 'Ok',
                        style: 'ok',
                    },
                ]
            );
        } catch (error) {
            console.log('Error downloading the new app version:', error);
            // Alert.alert('Download Error', 'An error occurred while downloading the new app version.');
        }
    };

    return (
        <View style={{ backgroundColor: COLORS.background }}>

            <View style={styles.container}>

                <View style={{ position: 'absolute', top: -190, alignSelf: 'center' }}>
                    <Text style={styles.heading}>Configure Your PostMyAd Plus App</Text>
                </View>
                {platformHeader === true ?
                    <View style={styles.buttonContainer}>
                        {renderButton(1, "Camera", require('../assests/camera.png'))}
                        {renderButton(2, `Orientation (${orientation})`, require('../assests/orientation.png'))}
                        {renderButton(3, "Contact Us ", require('../assests/contact-mail.png'))}
                        {renderButton(4, "Privacy & Policy", require('../assests/privacy.png'))}
                        {renderButton(5, "Cancellation Policy", require('../assests/cancellation.png'))}
                    </View>
                    :

                    <View style={styles.buttonContainer}>
                        {renderButtonn(1, "Camera", require('../assests/camera.png'))}
                        {renderButtonn(2, `Orientation (${orientation})`, require('../assests/orientation.png'))}
                        {renderButtonn(3, "Contact Us ", require('../assests/contact-mail.png'))}
                        {renderButtonn(4, "Privacy & Policy", require('../assests/privacy.png'))}
                        {renderButtonn(5, "Cancellation Policy", require('../assests/cancellation.png'))}
                    </View>
                }



                <View style={{ borderWidth: 1, borderColor: 'white', alignSelf: 'center', }}>
                    {uniqueIdd.length > 0 ?
                        <QRCode
                            value={uniqueIdd}
                            size={100}
                        />
                        :
                        null
                    }
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Scan To Get Id</Text>
                </View>

                {platformHeader === true ?
                    <View style={{ alignSelf: 'center', top: 40 }}>
                        {renderButton(6, "Check For Update", require('../assests/upload.png'))}
                    </View>
                    :
                    <View style={{ alignSelf: 'center', top: 40 }}>
                        {renderButtonn(6, "Check For Update", require('../assests/upload.png'))}
                    </View>
                }





                {platformHeader === true ?
                    <View style={{ alignSelf: 'center', top: 80 }}>
                        {renderButton(7, "Logout")}
                    </View>
                    :
                    <View style={{ alignSelf: 'center', top: 80 }}>
                        {renderButtonn(7, "Logout")}
                    </View>
                }

                <View style={{ top: 100 }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>App Version : {appVersion}</Text>
                </View>

                <View style={{ flexDirection: 'row', top: 190, alignSelf: 'center' }}>
                    <Image style={{ height: 40, width: 50, tintColor: 'white' }} source={require('../assests/Group.png')} />
                    <Image style={{ height: 30, width: 210, marginLeft: 10, tintColor: 'white' }} source={require('../assests/header1.png')} />
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: COLORS.background,
        transform: [{ rotate: '90deg' }],

    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        color: 'white',

    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        bottom: 30
    },
    button: {
        height: 130,
        width: 85,
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
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        // bottom: 70
        top: 14
    },

    focusedButton: {
        backgroundColor: "#303749",
        height: 130,
        width: 100,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#D6C2FF',
        bottom: 5
    },

    selectedButtonText: {
        color: "white",
    },

    buttonImage: {
        width: 50,
        height: 50,
        alignSelf: 'center',
        tintColor: 'white'
    },

    focusedButtonText: {
        top: 10
    },
    logbutton: {

    },
    button1: {
        // borderWidth: 1,
        height: 45,
        width: 200,
        borderRadius: 5,
        backgroundColor: "#303749",
        // borderColor: "black",
        elevation: 4
    },
    focusedButton1: {
        backgroundColor: "#303749",
        height: 50,
        width: 210,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#D6C2FF',
        // bottom: 100

    },
    selectedButton1: {

    },
    buttonText1: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        bottom: 40

    },
    focusedButtonText1: {


    },
    selectedButtonText1: {
        color: "white",

    },
    button2: {
        height: 135,
        width: 120,
        // paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "green",
        borderColor: "green",
        // left: 10,
        // right: 10

    },
    focusedButton2: {
        backgroundColor: "green",
        height: 130,
        width: 190,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'green',
        // bottom: 5

    }


});

export default SettingScreen;
