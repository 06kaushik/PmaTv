import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, AppState, Animated, Platform, PixelRatio, PermissionsAndroid, ImageBackground, TouchableOpacity, ToastAndroid, Dimensions, NativeEventEmitter, NativeModules, } from 'react-native'
import { RNCamera } from "react-native-camera";
import axios from "axios";
import { usePubNub } from "pubnub-react";
import Video from "react-native-video";
import RNFS from 'react-native-fs'
import moment from "moment";
import { measureConnectionSpeed } from 'react-native-network-bandwith-speed';
import NetInfo from '@react-native-community/netinfo';
import QRCode from "react-native-qrcode-svg";
import YoutubeIframe from "react-native-youtube-iframe";
import { useAppState } from '@react-native-community/hooks';
import RNRestart from 'react-native-restart';
import { useFocusEffect } from "@react-navigation/native";
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WifiManager from 'react-native-wifi-reborn';
import { captureScreen } from 'react-native-view-shot';
import Geolocation from '@react-native-community/geolocation';




const PlayerLandscape = ({ route, navigation }) => {


    const { uniqueId } = route.params
    const cameraRef = useRef(null)
    const cameraRef1 = useRef(null)
    const [views, setViews] = useState('')
    const pubnub = usePubNub();
    const [channels, setChannels] = useState([]);
    const [playfile, setPlayFile] = useState(true);
    const [playImage, setPlayImage] = useState('')
    const [fileType, setFileType] = useState('')
    const [webm, setWebm] = useState('')
    const [hasPermission, setHasPermission] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [speed, setSpeed] = useState('')
    const [url, setUrl] = useState('')
    const [burneradd, setBurnerAddDownload] = useState([])
    const [burneradplay, setBurnerPlay] = useState('')
    const [livestatus, setLiveStatus] = useState('true')
    const [stopBurner, setStopBurner] = useState(false)
    const [firstTimePlay, setFirstTimePlay] = useState(true)
    const [videoData, setVideoData] = useState([]);
    const [responseLength, setResponseLength] = useState([])
    const [activityLoader, setActivityLoader] = useState(false);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [counting, setCounting] = useState(0)
    const appState = useAppState();
    const [permissionrestart, setPermissionRestart] = useState(false);
    const [orderId2, setorderId2] = useState('');
    const [second2, setsecond2] = useState('')
    const inputRef1 = useRef(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const [platformHeader, setPlatformHeader] = useState('')


    const [savedImagePath, setSavedImagePath] = useState('');
    console.log('screeeennnnshott', savedImagePath);
    const [screenvisible, setScreenVisible] = useState(false)
    console.log('screen shot valueeeeee', screenvisible);
    const [location, setLocation] = useState({ latitude: null, longitude: null });



    const timestamp = moment().format('YYYY-MM-DD');
    const folderPath = RNFS.DownloadDirectoryPath + '/DeviceData'
    const apkFolder = folderPath + '/apk'
    const BurnerAd = folderPath + '/burnerAd'
    const logs = folderPath + '/logs'
    const path = logs + `/${uniqueId}_${timestamp}.csv`
    const Downloaded = folderPath + '/downloaded'
    const videoPath = folderPath + '/video';
    const imagePath = folderPath + '/image'
    const fileName = `Data_${timestamp}.json`;
    const jsonPath = folderPath + `/${fileName}`;
    const curDate = moment().format('YYYY-MM-DD')
    // const curDate1 = moment(moment().format('YYYY-MM-DD')).add(1, 'days').fo
    const connectedCircle = <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'green' }} />;
    const disconnectedCircle = <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red' }} />;
    const translateX = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    const textWidth = useRef(0);
    let getLiveLink = ''
    let FileTypeLink


    const screenDimensions = Dimensions.get('window');
    const screenWidthPoints = screenDimensions.width;
    const screenHeightPoints = screenDimensions.height;
    const pixelRatio = PixelRatio.get();
    const screenWidthPixels = Math.round(screenWidthPoints * pixelRatio);
    const screenHeightPixels = Math.round(screenHeightPoints * pixelRatio);




    ////// GEO LOCATION ///////

    const getGeolocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Update the state with the obtained location data
                setLocation({ latitude, longitude });
            },

        )
    }

    useEffect(() => {
        getGeolocation()
    }, [])



    const getPlatform = () => {
        const isTV =
            Platform.OS === 'android' &&
            Platform.isTV === true;
        setPlatformHeader(isTV)

    }

    useEffect(() => {
        return () => {
            AsyncStorage.setItem('orientationPreference', 'portrait');
        };
    }, []);



    //////////// USEEFFFECT MAIN ///////////////

    const translateY = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const animateHeader = () => {
        translateY.setValue(isHeaderVisible ? 0 : -35);
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: !isHeaderVisible ? 0 : -35,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(headerOpacity, {
                toValue: !isHeaderVisible ? 1 : 0,
                duration: 2500,
                useNativeDriver: true,
            }),
        ]).start();
    };


    ////// CAMERA FUNCTIONALITY ////////

    useEffect(() => {
        const requestPermissions = async () => {
            if (Platform.OS === 'android') {
                const { CAMERA, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE } = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);
                checkCameraPermission();
            }
        };

        requestPermissions();
    }, []);



    const checkCameraPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted) {
                setPermissionRestart(true)
                setHasPermission(true);
                console.log('grantedddddd', granted);
            }
            else {
                setHasPermission(false);
            }
            return granted;
        } else {
            const { status } = await Camera.getPermissionsAsync();

            return status === 'granted';
        }
    };


    useEffect(() => {

        const handleAppStateChange = (newAppState) => {
            if (newAppState === 'active') {
                // console.log('active');
            } else if (newAppState === 'background') {
                if (permissionrestart) {
                    RNRestart.restart();
                }
            }
        };

        AppState.addEventListener('change', handleAppStateChange);
    }, [permissionrestart])




    useEffect(() => {
        const startWork = () => {
            console.log("haspermission")
            // Perform other work here
            // This code will run only if the permission is granted
            // You can start other tasks or functions that depend on the permission

            if (isConnected) {
                setActivityLoader(true)
                GetAllBurnerAd();
                LiveStatus()

                // const intervalId     = setInterval(() => {                    
                //     getNetworkBandwidth();
                // }, 10000); // measure the network speed every 5 seconds

                // return () => clearInterval(intervalId);
            }
            else {
                setActivityLoader(false)
                if (burneradd.length > 0) {
                    setLiveStatus(true)
                }
            }
        };

        if (hasPermission) {
            startWork();
        }
    }, [hasPermission]);


    useEffect(() => {


        const deleteAndCreateFolder = async () => {

            try {
                await RNFS.unlink(BurnerAd)
            } catch (error) {
                console.log(error.message);

            }

            try {
                await RNFS.mkdir(BurnerAd)
            } catch (error) {
                console.log(error.message);

            }
            try {
                await RNFS.mkdir(apkFolder)
            } catch (error) {
                console.log(error.message);

            }
            try {
                await RNFS.mkdir(logs)
            } catch (error) {
                console.log(error.message);

            }
        }
        getPlatform()
        deleteAndCreateFolder().then(() => {

            if (isConnected && permissionrestart) {
                setActivityLoader(true)
                GetAllBurnerAd();
                LiveStatus()

                // const intervalId     = setInterval(() => {                    
                //     getNetworkBandwidth();
                // }, 10000); // measure the network speed every 5 seconds

                // return () => clearInterval(intervalId);
            }
            else {
                setActivityLoader(false)
                if (burneradd.length > 0) {
                    setLiveStatus(true)
                }
            }
        })


    }, [isConnected, permissionrestart])


    useEffect(() => {
        if (!activityLoader) {
            findBurnerVideo();
        }
    }, [activityLoader]);






    useEffect(() => {
        if (!livestatus || burneradd.length <= 0) {
            const intervalId = setInterval(() => {
                getNetworkBandwidth();
            }, 10000); // measure the network speed every 5 seconds

            return () => clearInterval(intervalId);
        }
        else {
            setActivityLoader(false)
            if (burneradd.length > 0) {
                setLiveStatus(true)
            }
        }

    }, [burneradd, livestatus])

    useEffect(() => {
        const startAnimation = () => {
            Animated.timing(translateX, {
                toValue: -textWidth.current,
                duration: 18000, // Adjust the duration to make it slower
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    translateX.setValue(Dimensions.get('window').width);
                    startAnimation();
                }
            });
        };

        if (burneradd.length > 0) {
            startAnimation();
        }
    }, [translateX, burneradd, livestatus]);

    const handleTextLayout = (e) => {
        textWidth.current = e.nativeEvent.layout.width;
    };


    const getNetworkBandwidth = async () => {
        try {
            const networkSpeed = NetworkBandwidthTestResults = await measureConnectionSpeed();
            console.log('Internet Speed', networkSpeed.speed.toFixed(2)); // Network bandwidth speed 
            setSpeed(networkSpeed.speed.toFixed(2))
        } catch (err) {
            //console.log(err);
        }
    }
    // useEffect(() => {

    // }, []);


    // const checkInternetAccess = async () => {
    //     try {
    //         const response = await fetch('https://www.google.com');
    //         return response.status === 200;
    //     } catch (error) {
    //         return false;
    //     }
    // };



    // const checkConnectivity = async () => {
    //     const isOnline = await checkInternetAccess();

    //     // console.log('is connected ', isOnline);
    //     if (!isOnline) {
    //         setIsPlaying(true)
    //     }
    // };


    //////// GET BURNER AD FROM API /////////
    // const GetAllBurnerAd = async () => {
    //     try {
    //         const [burnerAdResp, billboardAdResp] = await Promise.all([
    //             axios.get('/api/device/getBurnerAdsOriginalVideos'),
    //             axios.get(`/api/billboard/getBurnerAdByMacId/${uniqueId}`)
    //         ]);

    //         const billboardData = billboardAdResp?.data?.msg;

    //         const mergedData = {
    //             burnerAdData: [
    //                 ...burnerAdResp?.data?.msg,
    //                 ...(billboardData ? billboardData.map(data => ({ ...data })) : [])
    //             ]
    //         };
    //         setVideoData(mergedData.burnerAdData);
    //         setActivityLoader(true);

    //         if (mergedData?.burnerAdData?.length > 0) {
    //             await downloadVideos(mergedData.burnerAdData);
    //         }
    //     } catch (error) {
    //         console.log('Error from API', error);
    //         setActivityLoader(false);
    //     }
    // };
    const GetAllBurnerAd = async () => {
        try {
            const resp = await axios.get(`/api/billboard/getBurnerAdByMacId/${uniqueId}`);
            const data = resp?.data?.msg;
            setVideoData(data);
            if (data?.length >= 0) {
                await downloadVideos(data);
            }
        } catch (error) {
            console.log('error from burner api', error);
            setActivityLoader(false)
        }

        // finally {
        //     setActivityLoader(false); // Stop the loader after API call completes
        // }
    };
    const [downloadedCount, setDownloadedCount] = useState(0);
    const [newVideosToDownload, setNewVideosToDownload] = useState([]);

    const downloadVideos = async (data) => {
        let existingVideos = [];

        try {
            const filesInFolder = await RNFS.readdir(`${RNFS.DownloadDirectoryPath}/DeviceData/burnerAd`);
            existingVideos = filesInFolder.map(file => file);

            const newVideosToDownload = data.filter(item => !existingVideos.includes(item.Key.split('/').pop()));

            for (const item of newVideosToDownload) {
                const url = `https://s3.ap-south-1.amazonaws.com/storage.saps.one/${item.Key}`;
                const filename = url.substring(url.lastIndexOf('/') + 1);
                const destinationPath = `${RNFS.DownloadDirectoryPath}/DeviceData/burnerAd/${filename}`;

                if (!existingVideos.includes(filename)) {
                    try {
                        const response = await RNFS.downloadFile({
                            fromUrl: url,
                            toFile: destinationPath,
                            background: true,
                            discretionary: true,
                        }).promise;

                        setResponseLength(response);

                        // No need to set downloadedCount here, it's managed in the component state
                        existingVideos.push(filename);
                    } catch (error) {
                        // Handle download error
                    }
                }
            }

            const videosToDelete = existingVideos.filter(file => !data.some(item => file.includes(item.Key.split('/').pop())));
            for (const videoToDelete of videosToDelete) {
                const videoPath = `${RNFS.DownloadDirectoryPath}/DeviceData/burnerAd/${videoToDelete}`;
                console.log('VIDEO DELETE PATH', videoPath);
                await RNFS.unlink(videoPath);
            }

            findBurnerVideo();
            setActivityLoader(false);
        } catch (error) {
            // Handle error
        }
    };

    const findBurnerVideo = async () => {
        const directoryPath = `${RNFS.DownloadDirectoryPath}/DeviceData/burnerAd`;
        try {
            const files = await RNFS.readdir(directoryPath);
            // console.log('VIDEO FILES OR BURNER ADD', files);
            setBurnerAddDownload(files);
        } catch (error) {
            console.error(error);
        }
    };

    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const playNextVideo = () => {
        if (currentVideoIndex === burneradd.length - 1) {
            // All videos played, you can handle the logic accordingly
            // setIsPlaying(false); // Stop playing videos
            setCurrentVideoIndex(0);
            setIsPlaying(true);

            // console.log("currentIndex------", currentVideoIndex);
            return;
        }

        setCurrentVideoIndex(currentVideoIndex + 1);
        setIsPlaying(true);
        // console.log("currentIndex", currentVideoIndex, burneradd.length);
    };




    const takePicture = async (orderId, uniqueId) => {
        if (cameraRef) {

            try {
                const options = {
                    base64: true
                };

                const data = await cameraRef.current.takePictureAsync(options);
                setViews(JSON.stringify(data?.base64))
                clickPhoto(orderId, uniqueId, JSON.stringify(data?.base64))
            } catch (error) {
                // //console.log('Error taking picture:', error);
            }
        }
    };

    const clickPhoto = async (orderId, uniqueId, views) => {
        let body = {
            orderId: orderId,
            publishChannel: uniqueId,
            photo: views
        }
        // //console.log('body>>>>>', body);
        try {
            const resp = await axios.post("/api/order/orderViewsImage", body)
            //console.log("response from sendPhotoToServer====>", resp.data)

        } catch (error) {
            // //console.log('ERROR FROM CLICK PHOTO');

        }
    }

    //////////// PUBNUB IMPLEMENTATION /////////////

    const requestId = async (uniqueId) => {
        setChannels([uniqueId])
    }
    useEffect(() => {
        // //console.log("uniqueId  for Chanel UseEffect")
        if (uniqueId) {
            requestId(uniqueId)
        }
    }, [uniqueId])

    useEffect(() => {
        const listenerParams = { message: handleMessage }
        pubnub.addListener(listenerParams);
        pubnub.subscribe({ channels });
        return () => {
            pubnub.unsubscribe({ channels })
            pubnub.removeListener(listenerParams)
        }

    }, [channels]);

    // useEffect(() => {
    //     pubnub.addListener({
    //         status: function (statusEvent) {
    //             if (statusEvent.category === "PNNetworkDownCategory") {
    //                 pubnub.reconnect()
    //             }
    //             if (statusEvent.category === "PNConnectedCategory") {
    //             }
    //             if (statusEvent.category === "PNNetworkUpCategory") {
    //             } else {
    //             }
    //         },
    //         category: function (e) {
    //             // //console.log(e.category === "PNNetworkDownCategory");
    //         }, message: handleMessage
    //     });

    //     const apkChannel = 'YWxsZGV2aWNlYXBraW5zdGFsbHBvc3RteWFk'
    //     channels.push(apkChannel)
    //     pubnub.subscribe({ channels, })
    //     return () => {
    //         pubnub.unsubscribe({ channels })
    //         pubnub.removeListener(listenerParams)
    //     }
    // }, [channels])

    const handleMessage = async (event) => {
        const message = event.message;
        console.log('messsaaaaagegeee', message);
        // setLiveStatus(message?.eventname)
        // console.log('messafeeeeee', event.channel);
        if (event.channel == 'YWxsZGV2aWNlYXBraW5zdGFsbHBvc3RteWFk') {
            if (message.eventname == "download_apk") {
                downloadNewVersion()

            }
            if (message.eventname == "delete_user_file") {
                // deleteFiles(message.uniquename, message.filetype)

            }


        } else if (event.channel === uniqueId) {

            if (message.eventname == "getlive") {
                pubnub.publish(
                    {
                        channel: uniqueId,
                        message: {
                            mac_id: uniqueId,
                            eventname: "getlivelink",
                            link: getLiveLink,
                            fileType: FileTypeLink
                        },
                        qos: 2
                    },
                    (status, response) => {
                        // //console.log("Status Pubnub ===> ", status);
                    }
                );

            }

            // if (message.eventname == "get_device_file") {
            //     sendFileToPubnub(message.filetype)
            // }

            if (message.eventname == "delete_user_file") {
                // deleteFiles(message.uniquename, message.filetype)

            }
            if (message.eventname == "play") {
                PlayPauseVideo(message)


            }
            if (message.eventname == "stop") {
                PlayPauseVideo(message)
            }

            // if (message.eventname == "download_burner_ad") {
            //     DownloadBurnerAd(message.fileurl, message.uniquefilename, message.filetype)
            // }

            if (message.eventname == "download_apk") {
                downloadNewVersion()

            }
            if (message.eventname == "getdevicelogs") {
                SendLogFile()

            }
            if (message.eventname == "restartPmaApp") {
                RestartApp()
            }

            if (message.eventname == "takePmaAppSnapshot") {
                if (cameraVisible === false) {
                    setCameraVisible(true)
                    SnapShot()
                }
            }
            if (message.eventname == 'takePmaAppScreenShot') {
                if (screenvisible === false) {
                    setScreenVisible(true)
                    takeScreenShot()
                }
            }

        }
    }




    const [deviceInfo, setDeviceInfo] = useState(null);


    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const info = {
                uniqueId: DeviceInfo?.getUniqueId(),
                manufacturer: DeviceInfo?.getManufacturer(),
                model: DeviceInfo?.getModel(),
                brand: DeviceInfo?.getBrand(),
                systemName: DeviceInfo?.getSystemName(),
                systemVersion: DeviceInfo?.getSystemVersion(),
                deviceName: DeviceInfo?.getDeviceName(),
                bundleId: DeviceInfo?.getBundleId(),
                version: DeviceInfo?.getVersion(),
                readableVersion: DeviceInfo?.getReadableVersion(),
                buildNumber: DeviceInfo?.getBuildNumber(),
            };

            setDeviceInfo(info);
            console.log('all device info', deviceInfo?.brand);
        };

        fetchDeviceInfo();
    }, []);

    const RestartApp = () => {
        // Set a flag in AsyncStorage to indicate that getAllDeviceData should be called after restart
        AsyncStorage.setItem('callGetAllDeviceDataAfterRestart', 'true')
            .then(() => {
                // Restart the app
                RNRestart.restart();
            })
            .catch((error) => {
                console.error('Error setting flag:', error);
            });
    }



    AsyncStorage.getItem('callGetAllDeviceDataAfterRestart')
        .then((value) => {
            if (value === 'true') {
                // Remove the flag to prevent calling getAllDeviceData multiple times
                AsyncStorage.removeItem('callGetAllDeviceDataAfterRestart')
                    .then(() => {
                        // Call your getAllDeviceData function here
                        getAllDeviceData();
                    })
                    .catch((error) => {
                        console.error('Error removing flag:', error);
                    });
            }
        })
        .catch((error) => {
            console.error('Error getting flag:', error);
        });


    const [file, setFile] = useState(null);
    console.log('fileeeeeeeeeeeeeeee>>>>>>>>>>>', file?.uri);
    const [cameraVisible, setCameraVisible] = useState(false); // Initially, camera is hidden
    console.log('camera is true or falseeeeee', cameraVisible);
    const [uriImage, setUriImage] = useState('')



    const SnapShot = async () => {
        if (cameraRef1) {
            try {
                const options = {
                    base64: true
                };
                console.log('optionnssss', options);

                const data = await cameraRef1.current.takePictureAsync(options);
                // console.log('dataadaaaa', data);
                console.log('inside camera function');
                setUriImage(data?.uri)
                setFile(data);

                setTimeout(() => {
                    handleSubmit(data?.uri);
                }, 10000)
            } catch (error) {
                // Handle error here
                console.log('error from camera snappp', error);
            }
        }
    }


    const handleSubmit = async (dataImage) => {
        const datas = new FormData();

        datas.append('file', {
            uri: dataImage,
            type: 'image/jpeg', // Adjust the type based on your image format
            name: 'snapshot.jpg', // Adjust the name as needed
        });

        console.log('DATA OD IMAGE', datas._parts);

        try {
            let resp = await fetch("https://api.postmyad.ai/api/device/saveDeviceSnapshot",
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'macid': uniqueId
                    },
                    method: 'POST',
                    body: datas
                });
            let response = await resp.json();
            console.log('RESPONSE FROM VIDEO', response);
        } catch (error) {
            console.log('ERROR FROM VIDEO UPLOAAD', error?.response?.data?.message);
            console.error(error);

        }

    }

    const takeScreenShot = () => {
        captureScreen({
            format: 'jpg',
            quality: 0.8,
        }).then(

            (uri) => {
                setSavedImagePath(uri);
                setTimeout(() => {
                    handleSreenshot(uri)
                }, 10000)
            },
            (error) => console.error('Oops, Something Went Wrong', error),
        );

    };

    const handleSreenshot = async (screenImage) => {
        const datas = new FormData();
        datas.append('file', {
            uri: screenImage,
            type: 'image/jpeg', // Adjust the type based on your image format
            name: 'screenshot.jpg', // Adjust the name as needed
        });

        console.log('DATA OD IMAGE', datas._parts);

        try {
            let resp = await fetch("https://api.postmyad.ai/api/device/saveDeviceScreenshot",
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'macid': uniqueId
                    },
                    method: 'POST',
                    body: datas
                });
            let response = await resp.json();
            console.log('RESPONSE FROM SCREENSHOT', response);
        } catch (error) {
            console.log('ERROR FROM SCREENSHOT UPLOAAD', error?.response?.data?.message);
            console.error(error);

        }
    }

    const [isConnecteeed, setIsConnecteeed] = useState(true);
    const [wifiname, setWifiName] = useState('')

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
    }, []);

    const getWifiName = async () => {
        await NetInfo.fetch().then(state => {
            // console.log("Connection type", state.type);
            // console.log("SSID", state);
            setWifiName(state.details)

        });
    }

    const [data, setData] = useState('')
    // console.log('wifinameeee', data[0]?.SSID);

    const wifi = async () => {
        let list = await WifiManager.loadWifiList()
        console.log("=============== list =================")
        console.log(list);
        setData(list);
        console.log("=============== list =================")
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

    useEffect(() => {
        requestLocationPermission()

    }, [])

    const getAllDeviceData = async () => {
        let body = {
            appName: 'PmaPlusTv',
            brand: deviceInfo?.brand,
            buildNumber: deviceInfo?.buildNumber,
            bundleID: deviceInfo?.bundleId,
            ipaddresss: wifiname?.ipAddress,
            model: deviceInfo?.model,
            resolutionHeight: screenHeightPixels,
            resolutionWidth: screenWidthPixels,
            systemName: deviceInfo?.systemName,
            systemVersion: deviceInfo?.systemVersion,
            uniqueId: uniqueId,
            version: deviceInfo?.version,
            cameraPermission: hasPermission,
            deviceHeight: screenHeightPoints,
            deviceWidth: screenWidthPoints,
            latitude: location?.latitude,
            longitude: location?.longitude,
            wifi: {
                name: wifiname?.ssid,
                strength: wifiname?.strength,
                isConnected: isConnecteeed
            },
        }

        console.log('ALLL BODY DATAAAAA', body);
        try {
            const resp = await axios.post('/api/device/setAppInfo', body)
            console.log('RESPONSE FROM ALL DEVICE DATA', resp.data);
        } catch (error) {
            console.log('ERROR FROM ALL DEVICE API DATA', error);
        }
    }





    const SendLogFile = async () => {
        const data = new FormData();
        data.append('file', {
            files: ''
        });
        console.log('DATA OF FILE TO BE SEND', data);
        try {
            let resp = await fetch("https://api.postmyad.live/api/device/addDeviceLogs",
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'macId': uniqueId
                    },
                    method: 'POST',
                    body: data
                });
            let response = await resp.json();
            console.log('RESPONSE FROM FILE UPLOADED', response);

        } catch (error) {
            console.log('ERROR FROM LOG FILE UPLOADED', error.response.data.message);
            console.log('ERROR FROM LOG API FULL', error);

        }
    }


    const changeSecondDate = (data) => {
        const convertToSeconds = moment(moment().format('HH') + ':00:00', 'HH:mm:ss').add(data.second, 'seconds').format('HH:mm:ss');
        // globalConvert = moment(moment().format('HH') + ':00:00', 'HH:mm:ss').add(data.second, 'seconds').format('mm')
        // //console.log('>>>>>>>>>>', globalConvert);
        const getDateSeconds = moment(new Date()).format('YYYY-MM-DD') + `T${convertToSeconds}+05:30`
        return getDateSeconds
    }

    //////FUNCTION TO PLAY AND STOP //////////////////////

    function PlayPauseVideo(data) {

        const currentTime = moment();
        const startOfHour = moment().startOf('hour');
        const secondsFromStartOfHour = currentTime.diff(startOfHour, 'seconds');
        const DifferenceTime = secondsFromStartOfHour - data.second
        // console.log('secondss sssss difference ', DifferenceTime);

        //for google vision api------------------------------------------
        let orderId = data?.orderId;
        setorderId2(orderId);
        let second = changeSecondDate(data);
        setsecond2(second);
        // clearInterval(timer)





        if (data.eventname == "play" && (DifferenceTime <= 25)) {
            clearCache('')
            getLiveLink = data.contentLink
            FileTypeLink = data.filetype

            if (data && data.filetype == "image/jpeg") {
                setIsPlaying(false)
                setWebm('')
                setPlayFile('')
                setPlayImage('')
                setFileType('')
                contentLink = data.contentLink.replace("thumbnails", "fullimages").replace('.png', '.jpg')
                const filename = contentLink.replace('thumbnails', 'fullimages').replace('.png', '.jpg')

                setFileType(data.filetype)
                setPlayImage(filename)
                pubnub.publish(
                    {
                        channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                        message: {
                            mac_id: uniqueId,
                            eventname: "playresp",
                            orderId: orderId,
                            second: second,
                            status: "played"
                        },
                        qos: 2
                    },
                    (status, response) => {
                        // //console.log("Status Pubnub ===> ", status);
                    }
                );
                const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId, second: second, status: 'played' })
                try {
                    RNFS.appendFile(path, content + '\n', 'utf8');
                    console.log('Text file created successfully!');
                } catch (error) {
                    console.log('Error creating text file:', error);
                }
                setTimeout(() => {
                    takePicture(data?.orderId, uniqueId);
                }, 10000)


            }
            if (data && data.filetype == "video/mp4") {
                setIsPlaying(false)


                setWebm('')
                setPlayFile('')
                setPlayImage('')
                setFileType('')

                contentLink = data.contentLink.replace("compressedVideos", "originalVideos")
                const filename = contentLink.replace('compressedVideos', 'originalVideos')
                setFileType(data.filetype)
                setPlayFile(filename)
                pubnub.publish(
                    {
                        channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                        message: {
                            mac_id: uniqueId,
                            eventname: "playresp",
                            orderId: orderId,
                            second: second,
                            status: "played"
                        },
                        qos: 2
                    },
                    (status, response) => {
                        // console.log("Status Pubnub ===> ", status);
                    }
                );
                const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId, second: second, status: 'played' })


                try {
                    RNFS.appendFile(path, content + '\n', 'utf8');
                    console.log('Text file created successfully!');
                } catch (error) {
                    console.log('Error creating text file:', error);
                }
                setTimeout(() => {
                    takePicture(data?.orderId, uniqueId);
                }, 10000)


            }
            if (data && data.filetype == "video/webm") {
                setIsPlaying(false)

                setWebm('')
                setPlayFile('')
                setPlayImage('')
                setFileType('')

                contentLink = data.contentLink.replace("compressedVideos", "originalVideos")
                const filename = contentLink.replace('compressedVideos', 'originalVideos')
                setFileType(data.filetype)
                setWebm(filename)
                pubnub.publish(
                    {
                        channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                        message: {
                            mac_id: uniqueId,
                            eventname: "playresp",
                            orderId: orderId,
                            second: second,
                            status: "played"
                        },
                        qos: 2
                    },
                    (status, response) => {
                        // //console.log("Status Pubnub ===> ", status);
                    }
                );
                const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId, second: second, status: 'played' })


                try {
                    RNFS.appendFile(path, content + '\n', 'utf8');
                    console.log('Text file created successfully!');
                } catch (error) {
                    console.log('Error creating text file:', error);
                }
                setTimeout(() => {
                    takePicture(data?.orderId, uniqueId);
                }, 10000)

            }
            if (data && data.filetype == "url") {
                setIsPlaying(false)
                setFileType(data.filetype)
                setUrl(data.filename)

                pubnub.publish(
                    {
                        channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                        message: {
                            mac_id: uniqueId,
                            eventname: "playresp",
                            orderId: orderId,
                            second: second,
                            status: "played"
                        },
                        qos: 2
                    },
                    (status, response) => {
                        // //console.log("Status Pubnub ===> ", status);
                    }
                );
                const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId, second: second, status: 'played' })


                try {
                    RNFS.appendFile(path, content + '\n', 'utf8');
                    console.log('Text file created successfully!');
                } catch (error) {
                    console.log('Error creating text file:', error);
                }

                setTimeout(() => {
                    takePicture(data?.orderId, uniqueId);
                }, 10000)

            }
        }

        else if (data.eventname == "stop" && (DifferenceTime <= 25)) {
            setIsPlaying(true)
            getLiveLink = ''
            clearCache('')
            setWebm('')
            setPlayFile('')
            setPlayImage('')
            setFileType('')
        }

    }



    /////// CLEAR CACHE //////////////

    const clearCache = async () => {

        const cacheDirectory = '/data/user/0/com.pmaplus/cache';

        RNFS.unlink(cacheDirectory)
            .then(() => {
                //console.log('Cache cleared successfully');
            })
            .catch((error) => {
                //console.log('Error clearing cache:', error);
            });
    }


    //////////////////////// D-PAD FUNCTIONALIY /////////////////////////

    const handleInput1Focus = () => {
        inputRef1.current.focus();
        setFocusedButtonIndex(1);
    };


    const [focusedButtonIndex, setFocusedButtonIndex] = useState(1);
    // console.log('value changeeee', focusedButtonIndex);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

    let focusButton = 1

    let nextIndex = focusButton;
    // const navigate = (direction) => {
    //     // console.log('Key pressed:', direction);

    //     switch (direction) {
    //         case 19:
    //             nextIndex = 1
    //             setIsHeaderVisible(!isHeaderVisible);
    //             animateHeader()

    //             break;
    //         case 20:
    //             nextIndex = 1
    //             setIsHeaderVisible(isHeaderVisible);
    //             break;
    //         case 21:
    //             nextIndex = 1
    //             break;
    //         case 22:
    //             nextIndex = 1;
    //             break;
    //         case 23:
    //             // console.log("Select button pressed");
    //             break;
    //         case 4:
    //             if (navigation && navigation.goBack) {
    //                 navigation.goBack();
    //             }
    //             break;
    //         default:
    //             break;
    //     }


    //     if (nextIndex >= 1 && nextIndex <= 9) {
    //         setFocusedButtonIndex(nextIndex);
    //     }
    // };

    const handleKeyPress = (keycode) => {

        switch (keycode) {
            case 19:
                console.log("Left button pressed");
                setFocusedButtonIndex(1)
                setIsHeaderVisible(true);
                animateHeader()
                setTimeout(() => {
                    setIsHeaderVisible(false)
                }, 5000)

                break;
            case 20:
                setIsHeaderVisible(false);
                break;
            case 23:
                console.log("Enter button pressed");
                handleButtonPress(focusedButtonIndex);
                break;
            default:
                break;
        }
    }

    const handleButtonPress = useCallback(
        (buttonIndex) => {
            console.log('button index', buttonIndex);
            setSelectedButtonIndex(buttonIndex);

            switch (buttonIndex) {
                case 1:
                    // Navigate to camera screen
                    navigation.navigate("Settings1", { uniqueId: uniqueId });
                    break;
                default:
                    break;
            }
        },
        [navigation]
    );

    useFocusEffect(
        useCallback(() => {
            setFocusedButtonIndex(focusedButtonIndex); // Reset focus when the screen gains focus
        }, [])
    );



    const renderButton = (index, label, imageSource) => {
        const isFocused = index === focusedButtonIndex;
        const isSelected = index === selectedButtonIndex;
        const buttonStyle = [
            style.button,
            isFocused && style.focusedButton,
            isSelected && style.selectedButton,
        ];
        const textStyle = [
            style.buttonText,
            isSelected && style.selectedButtonText,
        ];

        return (
            <TouchableOpacity
                style={buttonStyle}
                onPress={() => handleButtonPress(focusedButtonIndex)}

            >
                <Image source={imageSource} style={style.buttonImage} />
                <Text style={textStyle}>{label}</Text>
            </TouchableOpacity>
        );
    };

    // const renderButton2 = (index, label, imageSource) => {
    //     const isFocused = index === focusedButtonIndex;
    //     const isSelected = index === selectedButtonIndex;
    //     const buttonStyle = [
    //         style.button,
    //         isFocused && style.focusedButton,
    //         isSelected && style.selectedButton,
    //     ];
    //     const textStyle = [
    //         style.buttonText,
    //         isSelected && style.selectedButtonText,
    //     ];

    //     return (
    //         <TouchableOpacity
    //             style={{ borderWidth: 1, height: '100%', width: '100%', borderColor: 'red' }}
    //             onPress={() => setIsHeaderVisible(true)}

    //         >
    //             <Image source={imageSource} style={style.buttonImage} />
    //             <Text style={textStyle}>{label}</Text>
    //         </TouchableOpacity>
    //     );
    // };

    useEffect(() => {
        const keyEventModule = NativeModules.KeyEventEmitter;
        const eventEmitter = new NativeEventEmitter(keyEventModule);



        const keyEventSubscription = eventEmitter.addListener('onKeyDown', (event) => {
            console.log('Key pressed:', event.keyCode);
            console.log('Event:', event); // Log the entire event object
            handleKeyPress(event.keyCode);
        });

        return () => {
            keyEventSubscription.remove();
        };
    }, []);

    ///////////// TO CHECK LIVE STATUS TO SHOW QR CODE ////////////

    const LiveStatus = async () => {
        let body = {
            macId: uniqueId
        }
        //console.log('response from ai status body', body);
        try {
            const resp = await axios.post('/api/device/isActiveDevice', body)
            // console.log('Response from LiveStatus Api', resp.data.success);
            setLiveStatus(resp.data.success)
        } catch (error) {
            // console.log('error from Live Status', error.response.data.msg);
            // setLiveStatus(false)

        }

    }

    const onLoad = () => {
        // console.log('Video is loaded and ready to be played');
        // clearInterval(intervalId);
    };

    const onError = (error) => {

        pubnub.publish(
            {
                channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                message: {
                    mac_id: uniqueId,
                    eventname: "playresp",
                    orderId: orderId2,
                    second: second2,
                    status: "Media does not support"
                },
                qos: 2
            },
            (status, response) => {
                // //console.log("Status Pubnub ===> ", status);
            }
        );
        const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId2, second: second2, status: 'Media does not support' })


        try {
            RNFS.appendFile(path, content + '\n', 'utf8');
            console.log('Text file created successfully!');
        } catch (error) {
            console.log('Error creating text file:', error);
        }
        ToastAndroid.show("MEDIA DOES NOT SUPPORT", ToastAndroid.LONG, ToastAndroid.BOTTOM);
    };

    useEffect(() => {

        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected == false) {
                // console.log('is connected condition inside if ', state);
                clearCache('')
                setWebm('')
                setPlayFile('')
                setPlayImage('')
                setFileType('')
                setIsPlaying(true)
            }

        });
        return () => {
            unsubscribe();
        };
    }, []);


    ///////////////// AUTO APP DOWNLOAD FUNCTION /////////////////////

    // const [progress, setProgress] = useState(0);
    // // console.log('progeresssssss', progress);


    // const downloadNewVersion = async () => {
    //     const s3DownloadUrl = 'https://s3.ap-south-1.amazonaws.com/storage.saps.one/Rahul_Assets/pmaplus.apk';
    //     const downloadDest = RNFS.DownloadDirectoryPath + '/DeviceData' + '/apk' + '/pmaplus.apk'

    //     try {
    //         // Check if the file already exists in the download directory
    //         const fileExists = await RNFetchBlob.fs.exists(downloadDest);

    //         if (fileExists) {
    //             // Delete the existing file before downloading the new version
    //             await RNFetchBlob.fs.unlink(downloadDest);
    //             console.log('Existing file deleted:', downloadDest);
    //         }

    //         // Download the new app version
    //         await RNFetchBlob.config({
    //             path: downloadDest,
    //             addAndroidDownloads: {
    //                 useDownloadManager: true,
    //                 notification: true,
    //                 path: downloadDest,
    //                 mime: 'application/vnd.android.package-archive',
    //                 title: 'New App Version',
    //                 description: 'Downloading new app version...',
    //                 mediaScannable: true,
    //             },
    //             indicator: true,
    //         })
    //             .fetch('GET', s3DownloadUrl)
    //             .progress((received, total) => {
    //                 const newProgress = Math.floor((received / total) * 100);
    //                 setProgress(newProgress);
    //             });
    //         console.log('App download complete');

    //         Alert.alert(
    //             'Download Complete',
    //             'The new app version has been downloaded successfully.Please Go To Download Folder To Install Latest App.',
    //             [
    //                 {
    //                     text: 'Ok',
    //                     style: 'ok',
    //                 },
    //             ]
    //         );
    //     } catch (error) {
    //         console.log('Error downloading the new app version:', error);
    //         // Alert.alert('Download Error', 'An error occurred while downloading the new app version.');
    //     }
    // };



    const deleteFiles = async (uniquename, filetype) => {
        console.log('delete burner ad', uniquename);

        const filepath = RNFS.DownloadDirectoryPath + '/DeviceData' + '/burnerAd' + `/${uniquename}`
        // //console.log('fileeeeeee pathhhhhh', filepath);
        await RNFS.unlink(filepath)
            .then(() => {
                findBurnerVideo()
                pubnub.publish(
                    {
                        channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                        message: {
                            mac_id: uniqueId,
                            eventname: "deleteburnerad",
                            filename: uniquename,
                            fileType: filetype
                        },
                        qos: 2
                    },
                    (status, response) => {
                        // //console.log("Status Pubnub ===> ", status);
                    }
                );
                // //console.log('File deleted');
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }



    return (

        <View style={{ backgroundColor: 'black' }}>
            {activityLoader ? (
                <View >
                    <View style={style.container}>
                        <Video
                            style={style.backgroundVideo}
                            source={require('../assests/gif.mp4')}
                            paused={false}
                            resizeMode="contain"
                            controls={false}
                            repeat={true}
                            onLoad={onLoad}
                            onError={onError}
                            muted={false}
                        />
                    </View>
                    <View style={{ justifyContent: 'center', alignSelf: 'center', position: 'absolute', bottom: '25%', transform: [{ rotate: '90deg' }] }}>
                        <Text style={{ textAlign: 'center', marginTop: 250, color: 'white', fontWeight: 'bold', fontSize: 20 }}>Initializing Media - ( {counting} Out Of {videoData?.length})</Text>
                    </View>
                </View>
            ) : (
                <View>
                    {cameraVisible ?
                        <RNCamera
                            ref={cameraRef1}
                            type={'front'}
                            style={{ opacity: 0, height: '0.1%', width: '0.1%', backfaceVisibility: 'hidden', backgroundColor: 'black' }}
                            // style={{ height: '10%', width: '10%'}}
                            captureAudio={false}
                            onMountError={(error) => console.log('Error mounting camera:', error)}
                        />
                        :
                        null
                    }


                    <View style={{ backgroundColor: 'black' }}>
                        {fileType === 'image/jpeg' || fileType === 'video/mp4' || fileType === 'video/webm' || fileType === 'url' ?
                            <RNCamera
                                ref={cameraRef}
                                style={{ opacity: 0, height: '0.1%', width: '0.1%', backfaceVisibility: 'hidden', backgroundColor: 'black' }}
                                // style={{ height: '10%', width: '10%'}}
                                captureAudio={false}
                                onMountError={(error) => console.log('Error mounting camera:', error)}
                            />
                            :
                            null
                        }

                        {(fileType === 'video/mp4' && playfile) ?
                            <View style={{ transform: [{ rotate: '90deg' }], height: 962, width: "60%", left: 193, position: "absolute", top: -210 }}>

                                {platformHeader === false ?
                                    <TouchableOpacity onPress={() => setIsHeaderVisible(!isHeaderVisible)}>
                                        <Video
                                            style={style.backgroundVideo}
                                            source={{ uri: playfile }}
                                            paused={false}
                                            resizeMode="contain"
                                            controls={false}
                                            repeat={true}
                                            onLoad={onLoad}
                                            onError={onError}
                                            muted={false}
                                        />
                                    </TouchableOpacity>
                                    :
                                    <Video
                                        style={style.backgroundVideo}
                                        source={{ uri: playfile }}
                                        paused={false}
                                        resizeMode="contain"
                                        controls={false}
                                        repeat={true}
                                        onLoad={onLoad}
                                        onError={onError}
                                        muted={false}
                                    />
                                }

                                {isHeaderVisible && (
                                    <ImageBackground source={require('../assests/blur.png')} style={style.headerContainer1} >
                                        <Animated.View
                                            style={[
                                                { transform: [{ translateY }] }
                                            ]}
                                        >

                                            <View style={{ flexDirection: 'row', marginLeft: 30, }}>
                                                <Image style={{ height: 30, width: 40, marginTop: 6 }} source={require('../assests/Group.png')} />
                                                <Image style={{ height: 30, width: 210, marginLeft: 10, marginTop: 6 }} source={require('../assests/header1.png')} />
                                            </View>
                                            <View style={style.innerContainer}>
                                                {/* <View style={style.circleContainer}>
                                                                    {isConnected ? connectedCircle : disconnectedCircle}
                                                                </View> */}
                                                <TouchableOpacity onFocus={handleInput1Focus}>
                                                    {renderButton(1, '', require('../assests/setting.png'))}
                                                </TouchableOpacity>
                                            </View>
                                        </Animated.View>
                                    </ImageBackground>
                                )}

                                <View style={{ alignSelf: 'center', height: 35, width: '100%', borderRadius: 2, bottom: 0, position: 'absolute' }}>
                                    <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                        <View style={{}}>
                                            <Text style={style.text} onLayout={handleTextLayout}>
                                                For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                            </Text>
                                        </View>
                                    </Animated.View>
                                </View>
                            </View>
                            :
                            (fileType === 'image/jpeg' && playImage) ?
                                <View style={{ transform: [{ rotate: '90deg' }], height: 962, width: "60%", left: 193, position: "absolute", top: -210 }}>

                                    {platformHeader === false ?
                                        <TouchableOpacity onPress={() => setIsHeaderVisible(!isHeaderVisible)}>
                                            <Image style={style.backgroundVideo} source={{ uri: playImage }} paused={false} resizeMode="contain" onLoad={onLoad} onError={onError} />
                                        </TouchableOpacity>
                                        :
                                        <Image style={style.backgroundVideo} source={{ uri: playImage }} paused={false} resizeMode="contain" onLoad={onLoad} onError={onError} />
                                    }
                                    {isHeaderVisible && (
                                        <ImageBackground source={require('../assests/blur.png')} style={style.headerContainer1} >
                                            <Animated.View
                                                style={[
                                                    { transform: [{ translateY }] }
                                                ]}
                                            >

                                                <View style={{ flexDirection: 'row', marginLeft: 30, }}>
                                                    <Image style={{ height: 30, width: 40, marginTop: 6 }} source={require('../assests/Group.png')} />
                                                    <Image style={{ height: 30, width: 210, marginLeft: 10, marginTop: 6 }} source={require('../assests/header1.png')} />
                                                </View>
                                                <View style={style.innerContainer}>
                                                    {/* <View style={style.circleContainer}>
                                                                    {isConnected ? connectedCircle : disconnectedCircle}
                                                                </View> */}
                                                    <TouchableOpacity onFocus={handleInput1Focus}>
                                                        {renderButton(1, '', require('../assests/setting.png'))}
                                                    </TouchableOpacity>
                                                </View>
                                            </Animated.View>
                                        </ImageBackground>
                                    )}
                                    <View style={{ alignSelf: 'center', height: 35, width: '100%', borderRadius: 2, bottom: 0, position: 'absolute' }}>
                                        <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                            <View style={{}}>
                                                <Text style={style.text} onLayout={handleTextLayout}>
                                                    For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                                </Text>
                                            </View>
                                        </Animated.View>
                                    </View>
                                </View>
                                :
                                (fileType === 'video/webm' && webm) ?
                                    <View style={{ transform: [{ rotate: '90deg' }], height: 962, width: "60%", left: 193, position: "absolute", top: -210 }}>

                                        {platformHeader === false ?
                                            <TouchableOpacity onPress={() => setIsHeaderVisible(!isHeaderVisible)}>
                                                <Video style={style.backgroundVideo} source={{ uri: webm }} paused={false} resizeMode="contain" controls={false} repeat={true} muted={false} onError={onError} />
                                            </TouchableOpacity>
                                            :
                                            <Video style={style.backgroundVideo} source={{ uri: webm }} paused={false} resizeMode="contain" controls={false} repeat={true} muted={false} onError={onError} />

                                        }
                                        {isHeaderVisible && (
                                            <ImageBackground source={require('../assests/blur.png')} style={style.headerContainer1} >
                                                <Animated.View
                                                    style={[
                                                        { transform: [{ translateY }] }
                                                    ]}
                                                >

                                                    <View style={{ flexDirection: 'row', marginLeft: 30, }}>
                                                        <Image style={{ height: 30, width: 40, marginTop: 6 }} source={require('../assests/Group.png')} />
                                                        <Image style={{ height: 30, width: 210, marginLeft: 10, marginTop: 6 }} source={require('../assests/header1.png')} />
                                                    </View>
                                                    <View style={style.innerContainer}>
                                                        {/* <View style={style.circleContainer}>
                                                                    {isConnected ? connectedCircle : disconnectedCircle}
                                                                </View> */}
                                                        <TouchableOpacity onFocus={handleInput1Focus}>
                                                            {renderButton(1, '', require('../assests/setting.png'))}
                                                        </TouchableOpacity>
                                                    </View>
                                                </Animated.View>
                                            </ImageBackground>
                                        )}

                                        <View style={{ alignSelf: 'center', height: 35, width: '100%', borderRadius: 2, bottom: 0, position: 'absolute' }}>
                                            <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                                <View style={{}}>
                                                    <Text style={style.text} onLayout={handleTextLayout}>
                                                        For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                                    </Text>
                                                </View>
                                            </Animated.View>
                                        </View>
                                    </View>
                                    :
                                    ((burneradd.length > 0 && isPlaying && livestatus)) ?



                                        <View style={{ transform: [{ rotate: '90deg' }], height: 962, width: "60%", left: 193, position: "absolute", top: -210 }}>



                                            {platformHeader === false ?
                                                <TouchableOpacity onPress={() => setIsHeaderVisible(!isHeaderVisible)}>
                                                    <Video
                                                        ref={videoRef}
                                                        style={style.backgroundVideo}
                                                        source={{
                                                            uri: `file:///storage/emulated/0/Download/DeviceData/burnerAd/${burneradd[currentVideoIndex]}`,
                                                        }}
                                                        paused={!isPlaying}
                                                        resizeMode="contain"
                                                        controls={false}
                                                        repeat={burneradd.length === 1 ? true : false}
                                                        onEnd={playNextVideo}
                                                        autoplay={true}
                                                        muted={false}
                                                        onError={onError}
                                                        onLoad={onLoad}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <Video
                                                    ref={videoRef}
                                                    style={style.backgroundVideo}
                                                    source={{
                                                        uri: `file:///storage/emulated/0/Download/DeviceData/burnerAd/${burneradd[currentVideoIndex]}`,
                                                    }}
                                                    paused={!isPlaying}
                                                    resizeMode="contain"
                                                    controls={false}
                                                    repeat={false}
                                                    onEnd={playNextVideo}
                                                    autoplay={true}
                                                    muted={false}
                                                    onError={onError}
                                                    onLoad={onLoad}
                                                />
                                            }
                                            {isHeaderVisible && (
                                                <ImageBackground source={require('../assests/blur.png')} style={style.headerContainer1} >
                                                    <Animated.View
                                                        style={[
                                                            { transform: [{ translateY }] }
                                                        ]}
                                                    >

                                                        <View style={{ flexDirection: 'row', marginLeft: 30, }}>
                                                            <Image style={{ height: 30, width: 40, marginTop: 6 }} source={require('../assests/Group.png')} />
                                                            <Image style={{ height: 30, width: 210, marginLeft: 10, marginTop: 6 }} source={require('../assests/header1.png')} />
                                                        </View>
                                                        <View style={style.innerContainer}>
                                                            {/* <View style={style.circleContainer}>
                                                                    {isConnected ? connectedCircle : disconnectedCircle}
                                                                </View> */}
                                                            <TouchableOpacity onFocus={handleInput1Focus}>
                                                                {renderButton(1, '', require('../assests/setting.png'))}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </Animated.View>
                                                </ImageBackground>
                                            )}


                                            <View style={{ alignSelf: 'center', height: 35, width: '100%', borderRadius: 2, bottom: 0, position: 'absolute' }}>
                                                <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                                    <View style={{}}>
                                                        <Text style={style.text} onLayout={handleTextLayout}>
                                                            For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                                        </Text>
                                                    </View>
                                                </Animated.View>
                                            </View>
                                        </View>

                                        :

                                        (fileType === 'url' && url) ?
                                            <View style={style.container}>
                                                <YoutubeIframe
                                                    height={'100%'}
                                                    width={'100%'}
                                                    videoId={url.slice(32, 44)}
                                                    play={true}

                                                />
                                            </View>
                                            :
                                            <ImageBackground style={{ height: '100%', width: '100%', backgroundColor: 'black', transform: [{ rotate: '90deg' }] }}>
                                                <View style={{ bottom: 100 }}>
                                                    <View>
                                                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 250, bottom: 97 }}>
                                                            {isConnected ?
                                                                <Text style={{ color: 'white', marginRight: 20 }}>{speed} Mbps</Text>
                                                                :
                                                                <Text style={{ color: 'white', marginRight: 20 }}>0 Mbps</Text>
                                                            }
                                                            <View style={{ marginRight: 20 }}>
                                                                {isConnected ? connectedCircle : disconnectedCircle}
                                                            </View>

                                                        </View>
                                                        <View style={{ bottom: 100, position: 'absolute', }}>
                                                            {isHeaderVisible && (
                                                                <ImageBackground source={require('../assests/blur.png')}>
                                                                    <Animated.View
                                                                        style={[
                                                                            { transform: [{ translateY }] }
                                                                        ]}
                                                                    >

                                                                        <View style={{ flexDirection: 'row', marginLeft: 220, }}>
                                                                            <Image style={{ height: 30, width: 40, marginTop: 40 }} source={require('../assests/Group.png')} />
                                                                            <Image style={{ height: 30, width: 210, marginLeft: 10, marginTop: 40 }} source={require('../assests/header1.png')} />
                                                                        </View>
                                                                        <View style={style.innerContainer}>
                                                                            {/* <View style={style.circleContainer}>
                                                                    {isConnected ? connectedCircle : disconnectedCircle}
                                                                </View> */}
                                                                            <TouchableOpacity onFocus={handleInput1Focus}>
                                                                                {renderButton(1, '', require('../assests/setting.png'))}
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </Animated.View>
                                                                </ImageBackground>
                                                            )}
                                                        </View>

                                                    </View>

                                                    <View>

                                                        <Video
                                                            style={{ height: '100%', width: '100%' }}
                                                            source={require('../assests/gif.mp4')}
                                                            paused={false}
                                                            resizeMode="contain"
                                                            controls={false}
                                                            repeat={true}
                                                            onLoad={onLoad}
                                                            onError={onError}
                                                            muted={false}
                                                        />
                                                    </View>

                                                    {livestatus !== true ?
                                                        <View style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'white', bottom: 150 }}>
                                                            <QRCode
                                                                value={uniqueId}
                                                                size={120}
                                                            />

                                                        </View>
                                                        :
                                                        <View style={{ alignSelf: 'center', borderWidth: 1, height: 35, width: '100%', borderRadius: 2, backgroundColor: 'white', borderColor: 'white', bottom: 0, position: 'absolute', }}>
                                                            <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                                                <View style={{}}>
                                                                    <Text style={style.text} onLayout={handleTextLayout}>
                                                                        For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                                                    </Text>
                                                                </View>
                                                            </Animated.View>
                                                        </View>
                                                    }
                                                </View>


                                            </ImageBackground>
                        }

                    </View >

                </View>
            )}
        </View>




    )
}

export default PlayerLandscape

const { height } = Dimensions.get("window");
const style = StyleSheet.create({
    backgroundVideo: {
        height: "100%",
        width: "100%",
        backgroundColor: "black",

    },
    textContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderWidth: 1,
        borderColor: 'white'
    },
    overlayText: {
        color: 'white',
        fontSize: 16,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '90deg' }]
    },
    textContainer: {},
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'rgba(183,54,248,255)',
        top: 7

    },

    row: {
        flexDirection: 'row',
    },
    button: {
        width: 30,
        height: 30,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '303749',
        borderColor: '#303749',
        bottom: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonImage: {
        width: 20,
        height: 20,
        marginTop: 20,
        tintColor: 'white',


    },
    focusedButton: {
        backgroundColor: 'rgba(183,54,248,255)',
        width: 25,
        height: 25,
        margin: 5,
        justifyContent: 'center',

        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(183,54,248,255)',
        bottom: 1,
        elevation: 4,
        right: 30,
        top: 5,

    },
    selectedButton: {
        backgroundColor: 'rgba(183,54,248,255)',
    },
    selectedButtonText: {
        color: 'rgba(183,54,248,255)',
    },
    headerContainer: {
        alignSelf: 'center',
        height: 40,
        width: '100%',
        borderRadius: 2,
        top: 0,
        position: 'absolute',
    },
    innerContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        position: 'absolute',

    },
    circleContainer: {
        marginRight: 40,
        top: 7
    },
    settingsIcon: {
        height: 20,
        width: 20,
        top: 2

    },
    headerContainer1: {
        height: 50,
        alignSelf: 'center',
        width: '100%',
        borderRadius: 2,
        top: 0,
        position: 'absolute'
    }

})
