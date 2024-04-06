import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { View, AppState, Platform, PermissionsAndroid, Dimensions, PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainLayout1 from './src/components/PubnubLayout1';
import AuthStack from './src/navigation/AuthStack';
import DeviceInfo from 'react-native-device-info';
import { ContextApi } from './src/components/ContextApi'
import { orientation } from './src/components/UseContext';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import { FETCH_URL } from './src/components/FetchApi';
import { useAppState } from '@react-native-community/hooks';
import RNRestart from 'react-native-restart';
import MainLayout from './src/components/PubnubLayout';


const screenDimensions = Dimensions.get('screen');
const pixelDensity = PixelRatio.get();

const App = () => {
  const [data, setData] = useState(null);
  const [uniqueId, setUniqueId] = useState(null)
  // console.log(uniqueId);
  const [userDetail, setDetail] = useState('')

  const [resolution, setResolution] = useState({
    width: screenDimensions.width * pixelDensity,
    height: screenDimensions.height * pixelDensity,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setResolution({
        width: screen.width * pixelDensity,
        height: screen.height * pixelDensity,
      });
    });
    return () => subscription?.remove();
  }, []);


  // console.log(`resohrihoiehoeh ${resolution.width} x ${resolution.height}`);


  const [deviceInfo, setDeviceInfo] = useState({
    uniqueId: '',
    manufacturer: '',
    brand: '',
    model: '',
    systemName: '',
    systemVersion: '',
    bundleId: '',
    appName: '',
    buildNumber: '',
    version: '',
    isEmulator: false,
  });

  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    const fetchDeviceInfo = async () => {

      const manufacturer = DeviceInfo.getManufacturer();
      const brand = DeviceInfo.getBrand();
      const model = DeviceInfo.getModel();
      const systemName = DeviceInfo.getSystemName();
      const systemVersion = DeviceInfo.getSystemVersion();
      const bundleId = DeviceInfo.getBundleId();
      const appName = DeviceInfo.getApplicationName();
      const buildNumber = DeviceInfo.getBuildNumber();
      const version = DeviceInfo.getVersion();
      const isEmulator = DeviceInfo.isEmulator();

      setDeviceInfo({

        manufacturer,
        brand,
        model,
        systemName,
        systemVersion,
        bundleId,
        appName,
        buildNumber,
        version,
        isEmulator,
      });

      // Get the IP address using your previous code here
      // For example, you can use the "ipify" API

      const response = await axios.get('https://api.ipify.org?format=json');
      const data = response.data;
      const ipAddress = data.ip;
      setIpAddress(ipAddress);
    };

    fetchDeviceInfo();
  }, []);





  const requestId = async () => {
    const deviceId = await DeviceInfo.getUniqueId()
    setUniqueId(deviceId)
  }

  useEffect(() => {
    requestId()
  }, [])


  axios.defaults.baseURL = FETCH_URL;
  let initialState = {
    userToken: null
  }

  const authReducer = (prevState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.userToken

        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null

        };
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.userToken

        };

    }

  }

  const [authState, dispatch] = useReducer(authReducer, initialState);

  const authData = useMemo(() => ({
    login: async (userToken, user) => {

      try {
        await AsyncStorage.setItem('TOKEN', JSON.stringify(userToken))
        await AsyncStorage.setItem('USER', JSON.stringify(user))
        setDetail(user)

        dispatch({ type: 'LOGIN', userToken })

        axios.defaults.headers.common = { Authorization: `Bearer ${userToken}` };

      } catch (error) {

      }
    },
    logout: async (userToken, user) => {
      try {
        await AsyncStorage.removeItem('TOKEN')
        await AsyncStorage.removeItem('USER')

        dispatch({ type: 'LOGOUT' })

      } catch (error) {

      }
    }
  }))

  const getUser = async () => {
    try {
      let userDetail = await AsyncStorage.getItem('USER');
      let data = JSON.parse(userDetail);
      setDetail(data)
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  useEffect(() => {
    const retriveToken = async () => {

      let userToken = await AsyncStorage.getItem('TOKEN')

      dispatch({ type: 'RETRIEVE_TOKEN', userToken: userToken ? JSON.parse(userToken) : null })


      axios.defaults.headers.common = { Authorization: `Bearer ${JSON.parse(userToken)}` };

    }
    retriveToken()

  }, [])

  const [orientationPreference, setOrientationPreference] = useState('landscape');
  // console.log('orientation', orientationPreference);

  useEffect(() => {
    AsyncStorage.getItem('orientationPreference')
      .then((preference) => {
        setOrientationPreference(preference);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const saveOrientationPreference = async () => {
      try {
        await AsyncStorage.setItem('orientationPreference', orientationPreference);
      } catch (error) {
        console.error(error);
      }
    };

    if (orientationPreference !== null) {
      saveOrientationPreference();
    }
  }, [orientationPreference]);


  if (uniqueId) {
    return (
      <>
        <ContextApi.Provider value={authData}>
          <orientation.Provider value={{ setOrientationPreference }}>
            <NavigationContainer>
              {authState?.userToken === null ? (
                <AuthStack />
              ) : (
                orientationPreference === 'portrait' ? (
                  <MainLayout uniqueId={uniqueId} />
                ) : (
                  <MainLayout1 uniqueId={uniqueId} />
                )
              )}
            </NavigationContainer>
          </orientation.Provider>
        </ContextApi.Provider>
      </>
    );
  } else {
    return (
      <>

      </>
    );
  }

}

export default App;
