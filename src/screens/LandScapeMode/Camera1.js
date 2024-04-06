import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import {COLORS} from '../../components/GlobalStyle';
import {RNCamera} from 'react-native-camera';
import DeviceInfo from 'react-native-device-info';

const CameraScreen1 = ({navigation}) => {
  const cameraRef = useRef(null);
  // console.log('CAMERAAAAAA REF', cameraRef);
  const [takingPic, setTakingPic] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);

  const requestId = async () => {
    const deviceId = await DeviceInfo.getUniqueId();
    setUniqueId(deviceId);
  };

  useEffect(() => {
    requestId();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    navigation.navigate('Settings1', {uniqueId: uniqueId});
    return true; // Return true to prevent the default back button action
  };
  const [file, setFile] = useState(null);

  const SnapShot = async () => {
    if (cameraRef) {
      try {
        const options = {
          base64: true,
        };
        console.log('optionnssss', options);

        const data = await cameraRef.current.takePictureAsync(options);
        console.log('inside camera function');
        // console.log('dataaaaaaaa>>>', data);
        setFile(data);
        handleSubmit();
      } catch (error) {
        // Handle error here
        console.log('error from camera snappp', error);
      }
    }
  };

  const handleSubmit = async () => {
    const datas = new FormData();
    datas.append('file', {
      uri: file?.uri,
      type: 'image/jpeg', // Adjust the type based on your image format
      name: 'snapshot.jpg', // Adjust the name as needed
    });

    console.log('DATA OD IMAGE', datas);

    try {
      let resp = await fetch(
        'https://api.postmyad.ai/api/device/saveDeviceSnapshot',
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            macid: uniqueId,
          },
          method: 'POST',
          body: datas,
        },
      );
      let response = await resp.json();
      console.log('RESPONSE FROM VIDEO', response);
    } catch (error) {
      console.log('ERROR FROM VIDEO UPLOAAD', error?.response?.data?.message);
      console.error(error);
    }
  };

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: COLORS.background,
      }}>
      <View
        style={{
          marginTop: 20,
          alignSelf: 'center',
        }}>
        {/* <TouchableOpacity  onPress={() => navigation.goBack('')}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image style={{ tintColor: 'white', marginLeft: 25, width: 30, height: 30, }} source={require('../../assests/back2.png')} />
                        <Text style={{ bottom: 3, marginLeft: 7, color: 'white', fontWeight: 'bold', fontSize: 25 }}>Back</Text>
                    </View>
                </TouchableOpacity > */}
        <TouchableOpacity onPress={() => SnapShot()}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 24,
            }}>
            Camera Setupaa
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          alignSelf: 'center',
          marginTop: 60,
          // transform: [{rotate: '90deg'}],
        }}>
        <RNCamera
          ref={cameraRef}
          type={'front'}
          style={{height: 340, width: 413, flex: 1}}
          orientation={'portrait'}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      </View>
    </View>
  );
};

export default CameraScreen1;