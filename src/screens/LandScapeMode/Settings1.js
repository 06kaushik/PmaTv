import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {ContextApi} from '../../components/ContextApi';
import {COLORS} from '../../components/GlobalStyle';
import QRCode from 'react-native-qrcode-svg';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {ScrollView} from 'react-native-gesture-handler';

const SettingScreen = ({route}) => {
  const navigation = useNavigation();
  const [focusedButtonIndex, setFocusedButtonIndex] = useState(1);
  const {logout} = useContext(ContextApi);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const {uniqueId} = route.params;
  const appVersion = DeviceInfo.getVersion();
  console.log('app version', appVersion);
  const [uniqueIdd, setUniqueIdd] = useState('');
  const [orientation, setOrientation] = useState('');
  const [check, setCheck] = useState('');
  console.log('versionf from back', check);
  const [update, setUpdate] = useState(false);
  console.log('CHECKKKKK UPDATEE', update);
  const [progress, setProgress] = useState(0);

  const folderPath = RNFS.DownloadDirectoryPath + '/DeviceData';
  const apkFolder = folderPath + '/apk';
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  // useEffect(() => {
  //   updateScreenWidth();
  // }, []);
  // const updateScreenWidth = () => {
  //   setScreenWidth(Dimensions.get('window').width);
  // };

  console.log(screenWidth, '<<<<<<screenWidth');
  const compareVersion = () => {
    if (check === appVersion) {
      console.log('compareeee', check === appVersion);
      setUpdate(false);
    } else {
      setUpdate(true);
    }
  };
  useEffect(() => {
    compareVersion();
  }, [check]);
  const getOrient = async () => {
    const resp = await AsyncStorage.getItem('orientationPreference');
    console.log('resppkmmseee', resp);
    setOrientation(resp);
  };

  useEffect(() => {
    getOrient();
  }, []);

  const requestId = async () => {
    const deviceId = await DeviceInfo.getUniqueId();
    setUniqueIdd(deviceId);
  };

  useEffect(() => {
    requestId();
  }, []);
  const handleButtonPress = useCallback(
    buttonIndex => {
      console.log('button index', buttonIndex);
      setSelectedButtonIndex(buttonIndex);

      switch (buttonIndex) {
        case 1:
          // Navigate to camera screen
          navigation.navigate('Camera1');
          break;
        case 2:
          // Navigate to screen 2
          navigation.navigate('Orientation1');
          break;
        case 3:
          // Navigate to screen 3
          navigation.navigate('Contact1');
          break;
        case 4:
          // Navigate to screen 4
          navigation.navigate('Privacy1');
          break;
        case 5:
          // Navigate to screen 4
          navigation.navigate('Terms1');
          break;
        case 6:
          // Navigate to screen 4

          showConfirmDialog(null, check);

          break;
        case 7:
          logout();

          break;
        default:
          break;
      }
    },
    [navigation, check],
  );
  useFocusEffect(
    useCallback(() => {
      // setFocusedButtonIndex(focusedButtonIndex); // Reset focus when the screen gains focus
    }, []),
  );

  const handleKeyPress = keycode => {
    switch (keycode) {
      case 21:
        console.log('Left button pressed');
        setFocusedButtonIndex(prevIndex =>
          prevIndex === 1 ? 7 : prevIndex - 1,
        );
        break;
      case 22:
        console.log('Right button pressed');
        setFocusedButtonIndex(prevIndex =>
          prevIndex === 7 ? 1 : prevIndex + 1,
        );
        break;
      case 23:
        // console.log("Enter button pressed");
        // handleButtonPress(focusedButtonIndex);
        break;
      default:
        break;
    }
  };

  const renderButton = (index, label, imageSource) => {
    console.log('indexxxx', index);
    const isFocused = index === focusedButtonIndex;
    const isSelected = index === selectedButtonIndex;
    const buttonStyle = [
      styles.button,
      isFocused ? styles.focusedButton : null,
      // isSelected && styles.selectedButton,
    ];
    const textStyle = [
      styles.buttonText,
      isFocused ? styles.focusedButtonText : null,
      isSelected && styles.selectedButtonText,
    ];
    const buttonStyle1 = [
      styles.button1,
      isFocused ? styles.focusedButton1 : null,
      isSelected && styles.selectedButton1,
    ];
    const textStyle1 = [
      styles.buttonText1,
      isFocused ? styles.focusedButtonText1 : null,
      isSelected && styles.selectedButtonText1,
    ];
    const buttonStyle2 = [
      styles.button2,
      isFocused ? styles.focusedButton2 : null,
      // isSelected && styles.selectedButton1,
    ];

    return (
      <TouchableOpacity
        // key={index}
        // style={(index === 7 ? buttonStyle1 : buttonStyle) && (index === 6 ? buttonStyle2 : buttonStyle)}
        style={
          index === 7
            ? buttonStyle1
            : index === 6 && update === true
            ? buttonStyle2
            : buttonStyle
        }
        onPress={() => handleButtonPress(index)}>
        <Image source={imageSource} style={styles.buttonImage} />
        <Text style={index === 7 ? textStyle1 : textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  };
  const renderButtonn = (index, label, imageSource) => {
    console.log('indexxxx', index);
    const isFocused = index === focusedButtonIndex;
    const isSelected = index === selectedButtonIndex;
    const buttonStyle = [
      styles.button,
      isFocused ? styles.focusedButton : null,
      // isSelected && styles.selectedButton,
    ];
    const textStyle = [
      styles.buttonText,
      isFocused ? styles.focusedButtonText : null,
      isSelected && styles.selectedButtonText,
    ];
    const buttonStyle1 = [
      styles.button1,
      isFocused ? styles.focusedButton1 : null,
      isSelected && styles.selectedButton1,
    ];
    const textStyle1 = [
      styles.buttonText1,
      isFocused ? styles.focusedButtonText1 : null,
      isSelected && styles.selectedButtonText1,
    ];
    const buttonStyle2 = [
      styles.button2,
      isFocused ? styles.focusedButton2 : null,
      // isSelected && styles.selectedButton1,
    ];

    return (
      <TouchableOpacity
        // key={index}
        style={
          index === 7
            ? buttonStyle1
            : index === 6 && update === true
            ? buttonStyle2
            : buttonStyle
        }
        onPress={() => handleButtonPress(index)}>
        <Image source={imageSource} style={styles.buttonImage} />
        <Text style={index === 7 ? textStyle1 : textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const keyEventModule = NativeModules.KeyEventEmitter;
    const eventEmitter = new NativeEventEmitter(keyEventModule);

    const keyEventSubscription = eventEmitter.addListener(
      'onKeyDown',
      event => {
        console.log('Key pressed:', event.keyCode);
        console.log('Event:', event); // Log the entire event object
        handleKeyPress(event.keyCode);
      },
    );

    return () => {
      keyEventSubscription.remove();
    };
  }, []);

  const [platformHeader, setPlatformHeader] = useState('');

  const getPlatform = () => {
    const isTV = Platform.OS === 'android' && Platform.isTV === true;
    setPlatformHeader(isTV);
  };
  useEffect(() => {
    getPlatform();
  }, []);

  /////////////// CHECK APK VERSIONNN /////////////////

  const checkVersionApk = async () => {
    try {
      const resp = await axios.get('/api/apk/getAllVersion');
      // console.log('all version of APK', resp?.data?.data[0]?.version);
      setCheck(resp?.data?.data[0]?.version);
    } catch (error) {
      console.log('error from apk', error);
    }
  };

  useEffect(() => {
    checkVersionApk();
  }, []);

  const showConfirmDialog = (item, check) => {
    return Alert.alert('UPDATE?', `Are you sure you want to UPDATE ?`, [
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          checkVersionApk().then(() => {
            checkUpdate(check);
          });
        },
      },
      {
        text: 'No',
      },
    ]);
  };

  const checkUpdate = async () => {
    try {
      const resp = await axios.get(`/api/apk/getApkByVersion/${check}`);
      console.log('check UPDATEEEEEE ', resp?.data?.data);
      if (resp?.data?.data?.name === appVersion) {
        Alert.alert('No Update Available');
      } else {
        downloadNewVersion(resp?.data?.data?.contentLink);
      }
    } catch (error) {
      console.log('errr from check update', error);
    }
  };

//   const downloadNewVersion = () => {
//     const s3DownloadUrl =
//       'https://s3.ap-south-1.amazonaws.com/storage.saps.one/APK/pmaplus.apk';
//     const downloadDest = RNFS.DocumentDirectoryPath + '/com.domain.pmaplus.apk';

//     // try {
//     // Check if the file already exists in the download directory
//     //   const fileExists = await RNFetchBlob.fs.exists(downloadDest);

//     //   if (fileExists) {
//     //     // Delete the existing file before downloading the new version
//     //     await RNFetchBlob.fs.unlink(downloadDest);
//     //     console.log('Existing file deleted:', downloadDest);
//     //   }

//     // Download the new app version
//     const download = RNFS.downloadFile({
//       fromUrl: s3DownloadUrl,
//       toFile: downloadDest,
//       progress: res => {
//         const newProgress = Math.floor(
//           (res.bytesWritten / res.contentLength) * 100,
//         );
//         setProgress(newProgress);
//       },
//     });
//     // path: downloadDest,
//     // addAndroidDownloads: {
//     //   useDownloadManager: true,
//     //   notification: true,
//     //   path: downloadDest,
//     //   mime: 'application/vnd.android.package-archive',
//     //   title: 'New App Version',
//     //   description: 'Downloading new app version...',
//     //   mediaScannable: true,
//     // },
//     // indicator: true,
//     //   })
//     //     .fetch('GET', s3DownloadUrl)
//     //     .progress((received, total) => {
//     //       const newProgress = Math.floor((received / total) * 100);
//     //       setProgress(newProgress);
//     //     });
//     //   console.log(res);
//     console.log('App download complete');
//     download.promise.then(result => {
//       console.log(result);
//       if (result.statusCode == 200) {
//         RNApkInstaller.install(downloadDest);
//       }
//     });

//     RNApkInstaller.haveUnknownAppSourcesPermission();

//     RNApkInstaller.showUnknownAppSourcesPermission();

//     //   Alert.alert(
//     //     'Download Complete',
//     //     'The new app version has been downloaded successfully.Please Go To DeviceData inside Download Folder To Install Latest App.',
//     //     [
//     //       {
//     //         text: 'Ok',
//     //         style: 'ok',
//     //       },
//     //     ],
//     //   );
//     //   ApkInstallerModule.installApk(downloadDest);
//     // } catch (error) {
//     //   console.log('Error downloading the new app version:', error);
//     //   // Alert.alert('Download Error', 'An error occurred while downloading the new app version.');
//     // }
//   };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        {screenWidth > 450 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 20,
              }}>
              <Image
                style={{height: 30, width: 40, tintColor: 'white', left: 10}}
                source={require('../../assests/Group.png')}
              />
              <Image
                style={{
                  height: 30,
                  width: 210,
                  left: 15,
                  tintColor: 'white',
                }}
                source={require('../../assests/header1.png')}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 15,
              }}>
              <Text style={styles.heading}>Configure Your App</Text>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-end',
                padding: 10,
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'white',
                  right: '3%',
                }}>
                {uniqueIdd.length > 0 ? (
                  <QRCode value={uniqueIdd} size={100} />
                ) : null}
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  Scan To Get Id
                </Text>
              </View>
            </View>

            {/* <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'red',
              marginTop: 20,
            }}>
            <Image
              style={{height: 30, width: 40, tintColor: 'white'}}
              source={require('../../assests/Group.png')}
            />
            <Image
              style={{
                height: 30,
                width: 210,
                marginLeft: 10,
                tintColor: 'white',
              }}
              source={require('../../assests/header1.png')}
            />
          </View>
          <Text style={styles.heading}>Configure Your App</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'white',
              marginRight: 24,
              marginTop: 20,
            }}>
            {uniqueIdd.length > 0 ? (
              <QRCode value={uniqueIdd} size={100} />
            ) : null}
            <Text
              style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
              Scan To Get Id
            </Text>
          </View> */}
          </View>
        ) : (
          <View style={styles.view}>
            <View
              style={{
                flexDirection: 'row',
                textAlign: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Image
                style={{height: 30, width: 40, tintColor: 'white'}}
                source={require('../../assests/Group.png')}
              />
              <Image
                style={{
                  height: 30,
                  width: 210,
                  marginLeft: 10,
                  tintColor: 'white',
                }}
                source={require('../../assests/header1.png')}
              />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginTop: 20,
                color: 'white',
                alignSelf: 'center',
              }}>
              Configure Your App
            </Text>
          </View>
        )}
        <View style={{flex: 1, justifyContent: 'center'}}>
          {platformHeader === true ? (
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  bottom: 60,
                }}>
                {renderButton(1, 'Camera', require('../../assests/camera.png'))}
                {renderButton(
                  2,
                  `Orientation (${orientation})`,
                  require('../../assests/orientation.png'),
                )}
                {renderButton(
                  3,
                  'Contact Us ',
                  require('../../assests/contact-mail.png'),
                )}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  bottom: 30,
                }}>
                {renderButton(
                  4,
                  'Privacy & Policy',
                  require('../../assests/privacy.png'),
                )}
                {renderButton(
                  5,
                  'Cancellation Policy',
                  require('../../assests/cancellation.png'),
                )}
                {renderButton(
                  6,
                  'Check Update',
                  require('../../assests/upload.png'),
                )}
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  bottom: 10,
                }}>
                {renderButtonn(
                  1,
                  'Cameraa',
                  require('../../assests/camera.png'),
                )}
                {renderButtonn(
                  2,
                  `Orientation (${orientation})`,
                  require('../../assests/orientation.png'),
                )}
                {renderButtonn(
                  3,
                  'Contact Us ',
                  require('../../assests/contact-mail.png'),
                )}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                {renderButtonn(
                  4,
                  'Privacy & Policy',
                  require('../../assests/privacy.png'),
                )}
                {renderButtonn(
                  5,
                  'Cancellation Policy',
                  require('../../assests/cancellation.png'),
                )}
                {renderButtonn(
                  6,
                  'Check Update',
                  require('../../assests/upload.png'),
                )}
              </View>
            </View>
          )}
        </View>
        {screenWidth > 450 ? null : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <View style={{borderWidth: 1, borderColor: 'white'}}>
              {uniqueIdd.length > 0 ? (
                <QRCode value={uniqueIdd} size={100} />
              ) : null}
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Scan To Get Id
              </Text>
            </View>
          </View>
        )}
        {platformHeader === true ? (
          <View style={{alignSelf: 'center', bottom: 10}}>
            {renderButton(7, 'Logout')}
          </View>
        ) : (
          <View style={{alignSelf: 'center', bottom: 10}}>
            {renderButtonn(7, 'Logout')}
          </View>
        )}

        <View style={{marginBottom: 30, marginTop: 40}}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
            App Version : {appVersion}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // justifyContent: "center",
    // alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'row',
    bottom: 30,
  },
  button: {
    height: 135,
    width: 103,
    // paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#303749',

    // left: 10,
    // right: 10
  },

  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    top: 8,
    // bottom: 70
  },

  focusedButton: {
    backgroundColor: '#303749',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D6C2FF',
  },

  selectedButtonText: {
    color: 'white',
  },

  buttonImage: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    tintColor: 'white',
  },

  focusedButtonText: {
    top: 10,
  },
  logbutton: {},
  button1: {
    // borderWidth: 1,
    top: 30,
    height: 45,
    width: 200,
    borderRadius: 5,
    // backgroundColor: '#303749',
    // borderColor: "black",
    elevation: 4,
  },
  focusedButton1: {
    backgroundColor: '#303749',
    height: 50,
    width: 210,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D6C2FF',
    // bottom: 100
  },
  selectedButton1: {},
  buttonText1: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    bottom: 45,
  },
  focusedButtonText1: {},
  selectedButtonText1: {
    color: 'white',
  },
  button2: {
    height: 135,
    width: 103,
    // paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    borderColor: 'green',
    // left: 10,
    // right: 10
  },
  focusedButton2: {
    backgroundColor: 'green',
    height: 130,
    width: 190,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'green',
    bottom: 5,
  },
});

export default SettingScreen;