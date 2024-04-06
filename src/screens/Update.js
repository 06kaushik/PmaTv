import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity , Image, StyleSheet, Dimensions, But } from 'react-native'
import { COLORS } from "../components/GlobalStyle";




const UpdateScreen = ({ navigation }) => {




    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginLeft: 16, marginRight: 16 }}>
                <TouchableOpacity  onPress={() => navigation.goBack('')}>
                    <View style={{ flexDirection: 'row', transform: [{ rotate: '-90deg' }], top: 430 }}>
                        <Image style={{ tintColor: 'white', marginLeft: 25, width: 30, height: 30, }} source={require('../assests/back2.png')} />
                        <Text style={{ bottom: 3, marginLeft: 7, color: 'white', fontWeight: 'bold', fontSize: 25 }}>Back</Text>
                    </View>
                </TouchableOpacity >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, transform: [{ rotate: '-90deg' }], right: 460, top: 170 }}>Updates</Text>
                <Text style={{}}> </Text>
            </View>

            <View style={{ borderWidth: 1, height: 370, width: '50%', alignSelf: 'center', marginTop: 50, borderRadius: 15, borderColor: COLORS.card, elevation: 4, backgroundColor: COLORS.card, transform: [{ rotate: '-90deg' }], bottom: 30 }}>
                <View style={{ marginTop: 10 }}>
                    <Image style={{ alignSelf: 'center', }} source={require('../assests/logo.png')} />
                    <Image style={{ alignSelf: 'center', height: 80, width: '90%' }} source={require('../assests/textlogo.png')} />
                </View>
                <View style={{ borderWidth: 1, height: 77, width: '90%', alignSelf: 'center', borderRadius: 15, borderColor: '#8409F4', elevation: 4, backgroundColor: '#8409F4', marginTop: 50 }}>
                    <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', textAlign: 'center', top: 18 }}>Update Available</Text>
                </View>

            </View>

        </View>

    )
}

export default UpdateScreen

