import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity , Image, PermissionsAndroid } from 'react-native'
import { COLORS } from "../components/GlobalStyle";
import NetInfo from "@react-native-community/netinfo";
import NetworkBandwidth, { measureConnectionSpeed } from 'react-native-network-bandwith-speed';



const SpeedTest = ({ navigation }) => {

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


    // const getSpeed = () => {
    //     networkSpeed.startListenNetworkSpeed(({ downLoadSpeed, downLoadSpeedCurrent, upLoadSpeed, upLoadSpeedCurrent }) => {
    //         console.log(downLoadSpeed + 'kb/s')
    //         console.log('download current', downLoadSpeedCurrent + 'kb/s')
    //         setDownload(downLoadSpeedCurrent)
    //         console.log(upLoadSpeed + 'kb/s')
    //         console.log('upload current', upLoadSpeedCurrent + 'kb/s')
    //         setUpload(upLoadSpeedCurrent)
    //     })
    //     // networkSpeed.stopListenNetworkSpeed()
    // }

    // useEffect(() => {
    //     getSpeed()
    // }, [])





    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, transform: [{ rotate: '-90deg' }], right: 400 }}>
                <TouchableOpacity  onPress={() => navigation.goBack('')}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image style={{ tintColor: 'white', marginLeft: 25, width: 30, height: 30, }} source={require('../assests/back2.png')} />
                        <Text style={{ bottom: 3, marginLeft: 7, color: 'white', fontWeight: 'bold', fontSize: 25 }}>Back</Text>
                    </View>
                </TouchableOpacity >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, right: 250 }}>Speed Test</Text>
                <Text style={{}}> </Text>
            </View>

            <View>
                <Image style={{ height: 200, width: 200, alignSelf: 'center', tintColor: 'white', transform: [{ rotate: '-90deg' }], top: 90, right: 120 }} source={require('../assests/speed.png')} />
            </View>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center', left: 20, transform: [{ rotate: '-90deg' }] }}>   Your Current Internet Speed of “{wifiname}” Network is :</Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center', left: 100, marginTop: 20,transform: [{ rotate: '-90deg' }],bottom:90 }}>
                <View style={{ flexDirection: 'row', right: 40 }}>
                    <Image style={{ height: 32, width: 32, tintColor: 'white' }} source={require('../assests/down.png')} />
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', top: 8, left: 5 }}>DOWNLOAD</Text>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Image style={{ height: 38, width: 38, tintColor: 'white' }} source={require('../assests/upload.png')} />
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', top: 8, left: 3 }}>UPLOAD</Text>
                </View>

            </View>
            <View style={{}}>
                <View style={{ flexDirection: 'row', alignSelf: 'center', left: 200, marginTop: 20,transform: [{ rotate: '-90deg' }],bottom:120 }}>
                    <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>{downloadSpeed} Mbps</Text>
                    <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', left: 30 }}>{uploadSpeed} Mbps</Text>
                </View>
            </View>
        </View>
    )
}

export default SpeedTest