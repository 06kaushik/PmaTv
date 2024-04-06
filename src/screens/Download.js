import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity , Image, PermissionsAndroid } from 'react-native'
import { COLORS } from "../components/GlobalStyle";
import DatePicker from 'react-native-date-picker'





const DownloadScreen = ({ navigation }) => {

    const [time, setTime] = useState(new Date())
    const [open, setOpen] = useState(false)






    const timee = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log('TIMEEEEEE', timee);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, transform: [{ rotate: '-90deg' }], right: 400 }}>
                <TouchableOpacity  onPress={() => navigation.goBack('')}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image style={{ tintColor: 'white', marginLeft: 25, width: 30, height: 30, }} source={require('../assests/back2.png')} />
                        <Text style={{ bottom: 3, marginLeft: 7, color: 'white', fontWeight: 'bold', fontSize: 25 }}>Back</Text>
                    </View>
                </TouchableOpacity >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, right: 250 }}>Download Settings</Text>
                <Text style={{}}> </Text>
            </View>

            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginTop: 190, transform: [{ rotate: '-90deg' }], right: 300 }}>Automatic Advertisement Downloads</Text>

            <View style={{ borderWidth: 1, width: '50%', alignSelf: 'center', borderRadius: 5, backgroundColor: '#D6C2FF', borderColor: '#D6C2FF', transform: [{ rotate: '-90deg' }], bottom: 45, right: 180 }}>
                <Text style={{ color: '#6907C3', textAlign: 'center', fontWeight: 'bold', fontSize: 18, }}>PostMyAd will automatically download Schedule Advertisments during this scheduled window</Text>
            </View>

            <View style={{ flexDirection: 'row', transform: [{ rotate: '-90deg' }], bottom: 350, right: 40 }}>
                <View style={{ borderWidth: 1, width: 220, height: 80, borderRadius: 8, backgroundColor: 'rgba(214, 194, 255, 0.1)', borderColor: 'rgba(214, 194, 255, 0.1)', }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, marginLeft: 16 }}>Duration</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, marginLeft: 16, marginTop: 10 }}>24 Hours Before</Text>
                </View>

                <View style={{ borderWidth: 1, width: 240, height: 80, borderRadius: 8, backgroundColor: 'rgba(214, 194, 255, 0.1)', borderColor: 'rgba(214, 194, 255, 0.1)', left: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, marginLeft: 5, marginTop: 20 }}>Start Time</Text>
                        <View style={{ borderWidth: 1, height: 56, width: 100, borderRadius: 5, backgroundColor: '#272C3C', borderColor: 'white', marginLeft: 10, marginTop: 10 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity  onPress={() => setOpen(true)}>
                                    <Image style={{ height: 20, width: 20, tintColor: 'white', marginTop: 18, left: 8 }} source={require('../assests/clock.png')} />
                                </TouchableOpacity >
                                <Text style={{ color: 'white', marginLeft: 15, marginTop: 18 }}>{time ? time.toLocaleTimeString() : 'Select Time'}</Text>
                                <DatePicker
                                    modal
                                    open={open}
                                    date={time}
                                    onConfirm={(time) => {
                                        setOpen(false)
                                        setTime(time)
                                    }}
                                    onCancel={() => {
                                        setOpen(false)
                                    }}
                                />
                            </View>

                        </View>
                    </View>

                </View>
                </View>

                <View style={{ borderWidth: 1, width: 250, height: 80, borderRadius: 8, backgroundColor: 'rgba(214, 194, 255, 0.1)', borderColor: 'rgba(214, 194, 255, 0.1)', transform: [{ rotate: '-90deg' }],bottom:180,left:450}}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, marginTop: 20, alignSelf: 'center' }}>Save</Text>
                </View>
           

            <View style={{ marginLeft: 45, marginTop: 20,transform: [{ rotate: '-90deg' }],bottom:530,left:280 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, margin: 5 }}>Note :</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, margin: 5 }}>1. Active Internet Connection is required at scheduled time of this update.</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, margin: 5 }}>2. This will download advertisements before 24 hour of scheduled date.{'\n'}     Example : Advertisements scheduled for 9th april will be downloaded {'\n'}     on 8th april at 12:01 AM.</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, margin: 5 }}>3. This will enable offline streaming of advertisements.</Text>
            </View>

        </View>
    )
}

export default DownloadScreen