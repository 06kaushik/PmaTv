import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity , Image, PermissionsAndroid } from 'react-native'
import { COLORS } from "../components/GlobalStyle";
import RNFS from 'react-native-fs';
import { BarChart, PieChart } from "react-native-gifted-charts";




const StorageScreen = ({ navigation }) => {

    const [freestorage, setFreeStorage] = useState('')
    const [totalstorage, setTotalStorage] = useState('')
    const pieChart = [

        {
            value: 20,
            color: '#009FFF',
            gradientCenterColor: '#006DFF',
            focused: true,
        },
        { value: 7, color: '#93FCF8', gradientCenterColor: '#3BE9DE' },



    ]
    console.log('PIE DATA', pieChart);


    useEffect(() => {
        RNFS.getFSInfo()
            .then((info) => {
                console.log('Device storage info:', info);
                setFreeStorage(info?.freeSpace)
                setTotalStorage(info?.totalSpace)

            })
            .catch((error) => {
                console.log('Error getting device storage info:', error);
            });
    }, [])


    //////// TOTAL STORAGE //////////
    function totalStoragee() {

        const gb = totalstorage / 1073741824;
        return gb.toFixed(2);
    }

    const bytes = totalstorage;
    const gb = totalStoragee(bytes);
    console.log(`${bytes} bytes is equal to????? ${gb} GB`);


    ///// USED STORAGE //////////
    function FreeStoragee() {

        const gb = freestorage / 1073741824;
        return gb.toFixed(2);
    }

    const bytess = freestorage;
    const gbb = FreeStoragee(bytes);
    console.log(`${bytes} bytes is equal to????? ${gbb} GB`);







    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, transform: [{ rotate: '-90deg' }], right: 400 }}>
                <TouchableOpacity  onPress={() => navigation.goBack('')}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image style={{ tintColor: 'white', marginLeft: 25, width: 30, height: 30, }} source={require('../assests/back2.png')} />
                        <Text style={{ bottom: 3, marginLeft: 7, color: 'white', fontWeight: 'bold', fontSize: 25 }}>Back</Text>
                    </View>
                </TouchableOpacity >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, right: 250 }}>Storage</Text>
                <Text style={{}}> </Text>
            </View>
            <View style={{ alignSelf: 'center', marginTop: 120, transform: [{ rotate: '-90deg' }], right: 150 }}>
                <PieChart
                    data={pieChart}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={50}
                    innerRadius={30}

                />
            </View>

            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', transform: [{ rotate: '-90deg' }], bottom: 60, right: 40 }}>{gb}/{gbb} GB</Text>



            <View style={{ borderWidth: 1, height: 107, width: 406, alignSelf: 'center', borderRadius: 5, backgroundColor: 'rgba(214, 194, 255, 0.1)', borderColor: 'rgba(214, 194, 255, 0.1)', transform: [{ rotate: '-90deg' }], bottom: 120, left: 100 }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 16, marginTop: 10 }}>Total Internal Storage      {gb} GB</Text>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 16, marginTop: 20 }}>Free Internal Storage       {gbb} GB</Text>
            </View>



            <View style={{ borderWidth: 1, height: 57, width: 386, alignSelf: 'center', marginTop: 20, borderRadius: 5, backgroundColor: 'rgba(214, 194, 255, 0.1)', borderColor: 'rgba(214, 194, 255, 0.1)', transform: [{ rotate: '-90deg' }], bottom: 215, left: 250 }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginLeft: 16, marginTop: 10, textAlign: 'center' }}>Downloaded content will be automatically deleted
                    before downloading new schedule.</Text>
            </View>

        </View>
    )
}

export default StorageScreen