import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, PermissionsAndroid, FlatList,BackHandler } from 'react-native'
import { COLORS } from "../../components/GlobalStyle";
import WifiManager from 'react-native-wifi-reborn';
import NetInfo from "@react-native-community/netinfo";
import WifiModal1 from "./WifiModal";
// import WifiModal from "./wifiModal";

const Datas = [
    {
        id: 1,
        SSID: 'No wifi found',
        name: 'Edit Name, Address , profile picture',
    }
];



const WifiScreen1 = ({ navigation }) => {

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
        console.log('wifiiiifff iteeem list',item);
        return (
            <TouchableOpacity onPress={() => onclick_item(item)}>
                {item?.BSSID === wifiname?.bssid ?
                    <View style={{ borderWidth: 1, width: '95%', backgroundColor: COLORS.card, marginTop: 10, borderRadius: 5, borderColor: 'white', elevation: 4, marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Image style={{ height: 15, width: 15, tintColor: 'white', top: 3, left: 5 }} source={require('../../assests/wifilock.png')} />
                            <Text style={{ left: 25, color: 'white', fontWeight: 'bold' }}>{item.SSID}</Text>
                            {item?.BSSID === wifiname.bssid ?

                                <Text style={{ color: 'white', fontWeight: 'bold', left: 550, top: 10 }}>Connected</Text>

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
                            <Image style={{ height: 15, width: 15, tintColor: 'white', top: 5, left: 80 }} source={require('../../assests/wifilock.png')} />
                            <Text style={{ left: 100, top: 2, color: 'white', fontWeight: 'bold' }}>{item.SSID}</Text>
                            {item?.BSSID === wifiname.bssid ?

                                <Text style={{ color: 'white', fontWeight: 'bold', left: 550 }}>Connected</Text>

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
            <View style={{ marginTop: 40, marginLeft: 16, marginRight: 16, alignSelf: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, right: 40 }}>Wifi Setup</Text>
            </View>

            <View style={{ borderWidth: 1, width: '80%', backgroundColor: COLORS.card, alignSelf: 'center', marginTop: 20, borderRadius: 5, borderColor: COLORS.card, elevation: 4 }}>

                {modalVisible &&
                    <WifiModal1 modalView={selected} setModalVisible={setModalVisible} modalVisible={modalVisible} />
                }
                {data ?
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.BSSID}
                        ListFooterComponent={<View style={{ marginBottom: 200 }} />}
                    // ItemSeparatorComponent={ItemDivider}
                    // ListFooterComponent={<View style={{margin:50}}/>}
                    />
                    :
                    <FlatList
                        data={Datas}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    // ItemSeparatorComponent={ItemDivider}
                    // ListFooterComponent={<View style={{margin:50}}/>}

                    />
                }

                {/* <FlatList
                data={data}
                renderItem={renderItem}
                ListFooterComponent={<View style={{ marginBottom: 100 }} />}
            /> */}
            </View>
        </View>
    )
}

export default WifiScreen1