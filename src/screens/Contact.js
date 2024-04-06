import React, { useEffect, useState, useRef } from "react";
import { View, Text, BackHandler } from 'react-native'
import { COLORS } from "../components/GlobalStyle";





const ContactUs1 = ({ navigation }) => {
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => backHandler.remove();
    }, []);

    const handleBackPress = () => {
        navigation.goBack('Settings');
        return true; // Return true to prevent the default back button action
    };


    return (
        <View style={{ backgroundColor: COLORS.background }}>
            <View style={{ height: '100%', width: '100%', backgroundColor: COLORS.background, transform: [{ rotate: '90deg' }] }}>
                <View style={{ marginTop: 40, marginLeft: 16, marginRight: 16, alignSelf: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24, bottom: 190 }}>Contact Us </Text>
                </View>

                <View style={{ backgroundColor: 'white', elevation: 4, marginLeft: 20, marginRight: 20, marginTop: 50, borderRadius: 15, width: '32%', alignSelf: 'center', height: 100 }}>
                    <Text style={{
                        fontFamily: 'Oswald-Bold',
                        color: '#525252',
                        fontSize: 18,

                        marginTop: 5,
                        textAlign: 'center'
                    }}>Contact us if you face any Issue: </Text>
                    <View style={{ alignSelf: 'center', marginTop: 10 }}>
                        <Text>Mobile No : 9818286990</Text>
                        <Text>Email : hello@postmyad.ai</Text>
                    </View>

                    {/* <View style={{ borderWidth: 0.5, marginTop: 15, borderColor: '#B5B5C3' }} /> */}


                </View>
            </View>
        </View>
    )
}
export default ContactUs1

