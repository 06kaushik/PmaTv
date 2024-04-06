import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity , Image, PermissionsAndroid, FlatList } from 'react-native'
import { COLORS } from "../components/GlobalStyle";
import WifiManager from 'react-native-wifi-reborn';
import NetInfo from "@react-native-community/netinfo";

const Datas = [
    {
        id: 1,
        SSID: 'No wifi found',
        name: 'Edit Name, Address , profile picture',
    }
];



const WifiScreen = ({ navigation }) => {

    const [data, setData] = useState('')
    const [wifiname, setWifiName] = useState('')
    const [selected, setSelected] = React.useState(null)
    const [modalVisible, setModalVisible] = React.useState(false);

    const getWifiName = async () => {
        await NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("SSID", state.details);
            setWifiName(state.details)
        });

    }


    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "React Native Wifi Reborn App Permission",
                    message:
                        "Location permission is required to connect with or scan for Wifi networks. ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                wifi();
                getWifiName();
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };



    const wifi = async () => {
        let list = await WifiManager.loadWifiList()
        console.log("=============== list =================")
        console.log(list);
        setData(list);
        console.log("=============== list =================")
    }

    React.useEffect(() => {
        console.log("SCAN BOARD WIFI")
        requestLocationPermission();
    }, []);

    const onclick_item = (item) => {
        console.log("CLicked FLATLISTWIFIPAIRING >>>", item.SSID)
        setSelected(item.SSID)
        setModalVisible(true)
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity  onPress={() => onclick_item(item)}>
                {item?.BSSID === wifiname?.bssid ?
                    <View style={{ height: 40, width: 700, alignSelf: 'center', borderColor: COLORS.card, borderRadius: 5, margin: 10, backgroundColor: COLORS.background }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Image style={{ height: 15, width: 15, tintColor: 'white', top: 15, left: 5 }} source={require('../assests/wifilock.png')} />
                            <Text style={{ left: 100, top: 11, color: 'white', fontWeight: 'bold' }}>{item.SSID}</Text>
                            {item?.BSSID === wifiname.bssid ?

                                <Text style={{ color: 'white', fontWeight: 'bold', left: 450, top: 10 }}>Connected</Text>

                                :
                                item?.BSSID !== wifiname?.bssid ?
                                    <Text> </Text>
                                    :
                                    null
                            }

                        </View>
                    </View>
                    :
                    <View style={{ height: 23, width: 700, alignSelf: 'center', borderColor: COLORS.card, borderRadius: 5, margin: 10 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Image style={{ height: 15, width: 15, tintColor: 'white', top: 5, left: 5 }} source={require('../assests/wifilock.png')} />
                            <Text style={{ left: 100, top: 10, color: 'white', fontWeight: 'bold' }}>{item.SSID}</Text>
                            {item?.BSSID === wifiname.bssid ?

                                <Text style={{ color: 'white', fontWeight: 'bold', }}>Connected</Text>

                                :
                                item?.BSSID !== wifiname?.bssid ?
                                    <Text> </Text>
                                    :
                                    null
                            }

                        </View>


                    </View>
                }
            </TouchableOpacity >
        )

    }





    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, transform: [{ rotate: '-90deg' }], right: 400 }}>
                <TouchableOpacity  onPress={() => navigation.goBack('')}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image style={{ tintColor: 'white', marginLeft: 25, width: 30, height: 30, }} source={require('../assests/back2.png')} />
                        <Text style={{ bottom: 3, marginLeft: 7, color: 'white', fontWeight: 'bold', fontSize: 25 }}>Back</Text>
                    </View>
                </TouchableOpacity >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, right: 250 }}>Wifi Setup</Text>
                <Text style={{}}> </Text>
            </View>

            <View style={{ borderWidth: 1, width: '52%', backgroundColor: COLORS.card, alignSelf: 'center', marginTop: 20, borderRadius: 5, borderColor: COLORS.card, elevation: 4, transform: [{ rotate: '-90deg' }], bottom: 85 }}>

                {/* {modalVisible &&
                    <WifiModal modalView={selected} setModalVisible={setModalVisible} modalVisible={modalVisible} />
                } */}
                {data ?
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.BSSID}
                        ListFooterComponent={<View style={{ marginBottom: 200 }} />}

                    />
                    :
                    <FlatList
                        data={Datas}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}


                    />
                }


            </View>
        </View>
    )
}

export default WifiScreen