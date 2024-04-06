import React, { useRef, useState, useEffect } from "react";
import { PubNubProvider, usePubNub } from 'pubnub-react';
import PubNub from 'pubnub'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayerLandscape from "../screens/PlayerLandscape";
import RNFS from 'react-native-fs'
import CameraScreen from "../screens/Camera";
import SettingScreen from "../screens/Settings";
import UpdateScreen from "../screens/Update";
import SpeedTest from "../screens/SpeedTest";
import WifiScreen from "../screens/WifiScreen";
import StorageScreen from "../screens/Storage";
import DownloadScreen from "../screens/Download";
import PrivacyScreen from "../screens/Privacy";
import TermsScreen from "../screens/Terms";
import ContentPolicy from "../screens/Content";
import ContactUs from "../screens/Contact";
import OrientationScreen from "../screens/OrientationPort";
import axios from "axios";
import DeviceInfo from 'react-native-device-info';






const Stack = createNativeStackNavigator()



const MainLayout = (props) => {
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

            <Stack.Navigator screenOptions={{ headerShown: false }}>

                <Stack.Screen name="PlayerLandScape" component={PlayerLandscape} initialParams={{ uniqueId: uniqueId }} />
                <Stack.Screen name="Settings" component={SettingScreen} />
                <Stack.Screen name="Camera" component={CameraScreen} />
                <Stack.Screen name="Update" component={UpdateScreen} />
                <Stack.Screen name="SpeedTest" component={SpeedTest} />
                <Stack.Screen name="WifiScreen" component={WifiScreen} />
                <Stack.Screen name="Storage" component={StorageScreen} />
                <Stack.Screen name="Download" component={DownloadScreen} />
                <Stack.Screen name="Privacy" component={PrivacyScreen} />
                <Stack.Screen name="Content" component={ContentPolicy} />
                <Stack.Screen name="Terms" component={TermsScreen} />
                <Stack.Screen name="Contact" component={ContactUs} />
                <Stack.Screen name="OrientationPort" component={OrientationScreen} />



            </Stack.Navigator>

        </PubNubProvider>


    )

}

export default MainLayout;