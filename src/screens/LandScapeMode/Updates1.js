import React,{useState,useEffect} from "react";
import { View, Text, TouchableOpacity , Image,StyleSheet,Dimensions,But} from 'react-native'
import { COLORS } from "../../components/GlobalStyle";




const UpdateScreen1 = ({ navigation }) => {

    
    

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{  marginTop: 40, marginLeft: 16, marginRight: 16,alignSelf:'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>Updates</Text>
            </View>

            <View style={{ borderWidth: 1, height: 370, width: 614, alignSelf: 'center', marginTop: 50, borderRadius: 15, borderColor: COLORS.card, elevation: 4, backgroundColor: COLORS.card, }}>
                <View style={{ marginTop: 10 }}>
                    <Image style={{ alignSelf: 'center', }} source={require('../../assests/logo.png')} />
                    <Image style={{ alignSelf: 'center', }} source={require('../../assests/textlogo.png')} />
                </View>
                <View style={{ borderWidth: 1, height: 77, width: '90%', alignSelf: 'center', borderRadius: 15, borderColor: '#8409F4', elevation: 4, backgroundColor: '#8409F4', marginTop: 50 }}>
                    <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', textAlign: 'center', top: 18 }}>Update Available</Text>
                </View>

            </View>

        </View>
       
    )
}

export default UpdateScreen1

