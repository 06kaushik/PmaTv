import React, {useEffect, useState, useRef} from 'react';
import {View, Text, BackHandler} from 'react-native';
import {COLORS} from '../../components/GlobalStyle';

const ContactUs1 = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    navigation.goBack('Settings1');
    return true; // Return true to prevent the default back button action
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
      }}>
      <View
        style={{
          top: 15,
          alignSelf: 'center',
          position: 'absolute',
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}}>
          Contact Us{' '}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          elevation: 4,
          borderRadius: 15,
          alignSelf: 'center',
          alignItems: 'center',
          padding: 10,
        }}>
        <Text
          style={{
            fontFamily: 'Oswald-Bold',
            color: '#525252',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            marginVertical: 5,
            marginHorizontal: 5,
          }}>
          Contact us if you face any Issue:{' '}
        </Text>
        <Text style={{color: 'black'}}>Mobile No : 9818286990</Text>
        <Text style={{color: 'black'}}>Email : hello@postmyad.ai</Text>
      </View>
    </View>
  );
};
export default ContactUs1;