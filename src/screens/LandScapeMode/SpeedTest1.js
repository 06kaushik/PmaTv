import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity , Image, PermissionsAndroid,BackHandler } from 'react-native'
import { COLORS } from "../../components/GlobalStyle";
import NetInfo from "@react-native-community/netinfo";
import NetworkBandwidth, { measureConnectionSpeed } from 'react-native-network-bandwith-speed';



const SpeedTest1 = ({ navigation }) => {

    const [wifiname, setWifiName] = useState('')
    console.log('wifiname', wifiname);
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);



    const measureSpeeds = async () => {
        try {
            const results = await measureConnectionSpeed();
            setDownloadSpeed(results.speed.toFixed(2));
            setUploadSpeed(results.uploadSpeed.toFixed(2));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        measureSpeeds();
    }, []);

    const getWifiName = async () => {
        await NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("SSID", state.details.ssid);
            setWifiName(state.details.ssid)
        });

    }
    const permission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location permission is required for WiFi connections',
                message:
                    'This app needs location permission as this is required  ' +
                    'to scan for wifi networks.',
                buttonNegative: 'DENY',
                buttonPositive: 'ALLOW',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getWifiName()
            // You can now use react-native-wifi-reborn
        } else {
            console.log('error in ssid');
        }
    }
    useEffect(() => {
        permission()
    }, [])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        
        return () => backHandler.remove();
      }, []);
      
      const handleBackPress = () => {
        navigation.navigate('Settings1');
        return true; // Return true to prevent the default back button action
      };




    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{  marginTop: 40, marginLeft: 16, marginRight: 16,alignSelf:'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, right: 40 }}>Speed Test</Text>
            </View>

            <View>
                <Image style={{ height: 200, width: 200, alignSelf: 'center', tintColor: 'white', marginTop: 18, left: 20 }} source={require('../../assests/speed.png')} />
            </View>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, textAlign: 'center', left: 20 }}>Your Current Internet Speed of “{wifiname}” Network is :</Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center', left: 40, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', right: 40 }}>
                    <Image style={{ height: 32, width: 32, tintColor: 'white' }} source={require('../../assests/down.png')} />
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', top: 8, left: 5 }}>DOWNLOAD</Text>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Image style={{ height: 38, width: 38, tintColor: 'white' }} source={require('../../assests/upload.png')} />
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', top: 8, left: 3 }}>UPLOAD</Text>
                </View>

            </View>
            <View style={{}}>
                <View style={{ flexDirection: 'row', alignSelf: 'center', left: 20, marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>{downloadSpeed} Mbps</Text>
                    <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', left: 30 }}>{uploadSpeed} Mbps</Text>
                </View>
            </View>
        </View>
    )
}

export default SpeedTest1