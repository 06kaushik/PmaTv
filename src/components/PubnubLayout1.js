import React, { useRef, useState, useEffect } from "react";
import { PubNubProvider, usePubNub } from 'pubnub-react';
import PubNub from 'pubnub'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import RNFS from 'react-native-fs'
import PortraitScreen from "../screens/LandScapeMode/PlayerPortrait";
import CameraScreen1 from "../screens/LandScapeMode/Camera1";
import UpdateScreen1 from "../screens/LandScapeMode/Updates1";
import SpeedTest1 from "../screens/LandScapeMode/SpeedTest1";
import WifiScreen1 from "../screens/LandScapeMode/WifiScreen1";
import StorageScreen1 from "../screens/LandScapeMode/Storage1";
import DownloadScreen1 from "../screens/LandScapeMode/Download1";
import PrivacyScreen1 from "../screens/LandScapeMode/Privacy1";
import ContentPolicy1 from "../screens/LandScapeMode/Content1";
import TermsScreen1 from "../screens/LandScapeMode/TermsandCon1";
import ContactUs1 from "../screens/LandScapeMode/Contact1";
import SettingScreen1 from "../screens/LandScapeMode/Settings1";
import OrientationScreen1 from "../screens/LandScapeMode/OrientationLan";
import axios from "axios";
import DeviceInfo from 'react-native-device-info';


const Stack = createStackNavigator()

const MainLayout1 = (props) => {
    const uniqueId = props.uniqueId
    const [freestorage, setFreeStorage] = useState('')
    const [totalstorage, setTotalStorage] = useState('')
    const [devicestatus, setDeviceStatus] = useState('')
    const appVersion = DeviceInfo.getVersion();
    console.log('app version', appVersion);





    let pubnub = new PubNub({

        publishKey: "pub-c-90d5fa5c-df63-46c7-b5f2-2d6ad4efd775",
        subscribeKey: "sub-c-81c16c55-f391-4f72-8e57-2d9e052a360c",
        // uuid: uuid,
        restore: true,
        presenceTimeout: 20,
        autoNetworkDetection: true,

        userId: uniqueId,
        keepAliveSettings: {
            keepAliveMsecs: 3600,
            freeSocketKeepAliveTimeout: 3600,
            timeout: 3600,
            maxSockets: Infinity,
            maxFreeSockets: 256
        },
        withPresence: true

    });


    useEffect(() => {

        if (uniqueId && devicestatus !== 'Online') {
            pubnub.publish(
                {
                    channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                    message: {
                        mac_id: uniqueId,
                        eventname: "devicerestart",
                        status: "restarted",
                        version: appVersion
                    },
                    qos: 2,
                    publishTimeout: 5 * 60000
                },
                (status, response) => {
                    // console.log("Status Pubnub ===> ", status);
                }
            );


        }

    }, [])

    useEffect(() => {
        RNFS.getFSInfo()
            .then((info) => {
                // console.log('Device storage info:', info);
                setFreeStorage(info?.freeSpace)
                setTotalStorage(info?.totalSpace)

                pubnub.publish(
                    {
                        channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                        message: {
                            mac_id: uniqueId,
                            eventname: "diskSpace",
                            totalspace: (info?.totalSpace / 1073741824).toFixed(2),
                            freespace: (info?.freeSpace / 1073741824).toFixed(2),
                            version: appVersion
                        },
                        publishTimeout: 5 * 60000,
                        qos: 2
                    },
                    (status, response) => {
                        // console.log("Status Pubnub ===> ", status);
                    }
                );


            })
            .catch((error) => {
                console.log('Error getting device storage info:', error);
            });
    }, [])

    function totalStoragee() {

        const gb = totalstorage / 1073741824;
        return gb.toFixed(2);
    }

    const bytes = totalstorage;
    const gb = totalStoragee(bytes);
    // console.log(`${bytes} bytes is equal to????? ${gb} GB`);


    ///// USED STORAGE //////////
    function FreeStoragee() {

        const gb = freestorage / 1073741824;
        return gb.toFixed(2);
    }

    const bytess = freestorage;
    const gbb = FreeStoragee(bytes);


    const CheckOnlineStatus = async () => {
        try {
            const resp = await axios.get(`https://api.postmyad.ai/api/device/checkIsDeviceOnline?macId=${uniqueId}`)
            setDeviceStatus(resp?.data?.data?.deviceStatus)
        } catch (error) {

            console.log('eroorr from active status', error.response.data.msg);
        }

    }

    useEffect(() => {
        CheckOnlineStatus()
    }, [])


    return (
        <PubNubProvider client={pubnub}>

            <Stack.Navigator screenOptions={{ headerShown: false, }}>


                {/* <Stack.Screen name="LoginScreen" component={LoginScreen} initialParams={{ uniqueId: uniqueId }} /> */}
                <Stack.Screen name="PlayerPortrait" component={PortraitScreen} initialParams={{ uniqueId: uniqueId, }} />
                <Stack.Screen name="Settings1" component={SettingScreen1} />
                <Stack.Screen name="Camera1" component={CameraScreen1} />
                <Stack.Screen name="Update1" component={UpdateScreen1} />
                <Stack.Screen name="SpeedTest1" component={SpeedTest1} />
                <Stack.Screen name="WifiScreen1" component={WifiScreen1} />
                <Stack.Screen name="Storage1" component={StorageScreen1} />
                <Stack.Screen name="Download1" component={DownloadScreen1} />
                <Stack.Screen name="Orientation1" component={OrientationScreen1} />
                <Stack.Screen name="Privacy1" component={PrivacyScreen1} />
                <Stack.Screen name="Content1" component={ContentPolicy1} />
                <Stack.Screen name="Terms1" component={TermsScreen1} />
                <Stack.Screen name="Contact1" component={ContactUs1} />

            </Stack.Navigator>
        </PubNubProvider>
    )

}

export default MainLayout1;