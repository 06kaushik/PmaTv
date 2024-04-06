import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { useAppState } from '@react-native-community/hooks';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import { usePubNub } from "pubnub-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, AppState, Dimensions, Image, ImageBackground, NativeEventEmitter, NativeModules, PermissionsAndroid, PixelRatio, Platform, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, } from 'react-native';
import { RNCamera } from "react-native-camera";
import DeviceInfo from 'react-native-device-info';
import RNFS, { read } from 'react-native-fs';
import { measureConnectionSpeed } from 'react-native-network-bandwith-speed';
import QRCode from "react-native-qrcode-svg";
import RNRestart from 'react-native-restart';
import Video from "react-native-video";
import { captureScreen } from 'react-native-view-shot';
import WifiManager from 'react-native-wifi-reborn';
import YoutubeIframe from "react-native-youtube-iframe";
import RNFetchBlob from "rn-fetch-blob";
import { moderateScale, moderateScaleVertical } from "../../components/Responsive";
import { FETCH_URL } from "../../components/FetchApi";
import useSocket from "../../utility/socketservice";




const PortraitScreen = ({ route, navigation }) => {


    const { uniqueId } = route.params
    //(uniqueId);
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
    const [livestatus, setLiveStatus] = useState(true)
    const [videoData, setVideoData] = useState([]);
    const [responseLength, setResponseLength] = useState([])
    const [activityLoader, setActivityLoader] = useState(false);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [counting, setCounting] = useState(0)
    const [permissionrestart, setPermissionRestart] = useState(false);
    const [orderId2, setorderId2] = useState('');
    const [second2, setsecond2] = useState('')
    const inputRef1 = useRef(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const [platformHeader, setPlatformHeader] = useState('')
    const [medianotsupported, setMediaNotSupported] = useState('')
    const [savedImagePath, setSavedImagePath] = useState('');
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [videonamedata, setVideoNameData] = useState([])
    const [dynamicplay, setDynamicPlay] = useState(false)
    //('dynamic functionality', dynamicplay);


    const timestamp = moment().format('YYYY-MM-DD');
    const folderPath = RNFS.DownloadDirectoryPath + '/DeviceData'
    const apkFolder = folderPath + '/apk'
    const BurnerAd = folderPath + '/burnerAd'
    const JsonFile = folderPath + '/json'
    const logs = folderPath + '/logs'
    const path = logs + `/${uniqueId}_${timestamp}.txt`
    const logs1 = folderPath + '/offlineLogs'
    const offline = logs1 + '/' + timestamp;
    const path1 = offline + `/${uniqueId}_${moment().format('H')}.txt`
    const videoPath = folderPath + '/video';
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

    //////// SOCKET IMPLEMENTATION ///////////////////
    const { emit, on, removeListener } = useSocket(handleSocketConnect);
    useEffect(() => {
        emit('joinTvUser', uniqueId);

        on('play', (event) => {
            emit('playresp', { orderId: event?.data?.orderId, mac_id: event?.data?.mac_id, second: changeSecondDate(event?.data), secondNew: event?.data?.second, status: 'played' })
            PlayPauseVideo(event?.data)
        })
        on('stop', (event) => {
            //('Stop event from socket', event);
            PlayPauseVideo(event?.data)
        })
        on('getdevicelogs', (event) => {
            //('GetDeviceLogs from socket', event);
            SendLogFile()
        })
        on('restartPmaApp', (event) => {
            //('restartPmaApp from socket', event);
            AsyncStorage.setItem('callGetAllDeviceDataAfterRestart', 'true')
                .then(() => {
                    RNRestart.restart();
                })
                .catch((error) => {
                    console.error('Error setting flag:', error);
                });
            // RestartApp()
        })
        on('takePmaAppSnapshot', (event) => {
            //('takePmaAppSnapshot from socket', event);
            SnapShot()

        })
        on('takePmaAppScreenShot', (event) => {
            //('takePmaAppScreenShot from socket', event);
            takeScreenShot()
        })
        on('schedule_json', (event) => {
            //('schedule_json from socket', event);
            emit('playresp', { orderId: event?.data?.orderId, mac_id: event?.data?.mac_id, second: changeSecondDate(event?.data), secondNew: event?.data?.second, status: 'played' })
            setTimeout(() => {
                downloadJson()
            }, 12000);
        })

        on('instant_json', (event) => {
            //('instant_json from socket', event);
            emit('playresp', { orderId: event?.data?.orderId, mac_id: event?.data?.mac_id, second: changeSecondDate(event?.data), secondNew: event?.data?.second, status: 'played' })
            getInstantJson()

        })
        if (scheduleJsonData && instantJsonData) {
            //('Either schedule_json or instant_json event has occurred. Merging data...');
            readJson()
            mergeJsonData();
        }
        on('delete_video', (event) => {
            //('delete_video from socket', event);
            DeleteVideoInternal()
        })
        // on('send_logs', (event) => {
        //     uploadFilesToServer()
        // })
        return () => {
            removeListener()
        };
    }, [emit, on]);

    function handleSocketConnect() {
        //('Socket is connected');
    }


    const readLogFilesFromAllFolders = async () => {
        const currentFormattedDate = moment().format('YYYY-MM-DD');
        const logsFolderPath = RNFS.DownloadDirectoryPath + '/DeviceData/offlineLogs';
        const folders = await RNFS.readDir(logsFolderPath);

        const allLogContents = await Promise.all(
            folders.map(async (folder) => {
                if (folder.isDirectory() && folder.name !== currentFormattedDate) {
                    const folderPath = `${logsFolderPath}/${folder.name}`;

                    const files = await RNFS.readDir(folderPath);

                    const logContents = await Promise.all(
                        files.map(async (file) => {
                            if (file.isFile() && file.name.endsWith('.txt')) {
                                const filePath = `${folderPath}/${file.name}`;
                                return await RNFS.readFile(filePath, 'utf8');
                            }
                            return null;
                        })
                    );
                    // Remove null values (non-txt files) and return log contents
                    return {
                        date: folder.name,
                        contents: logContents.filter((content) => content !== null),
                    };
                }
                return null;
            })
        );
        // //('Log files from all folders (excluding current date):', allLogContents);
        return allLogContents.filter((folder) => folder !== null);
    };


    useEffect(() => {
        readLogFilesFromAllFolders()
    }, [])


    ////// GEO LOCATION ///////

    const getGeolocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
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
            AsyncStorage.setItem('orientationPreference', 'landscape');
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
                //('grantedddddd', granted);
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
            } else if (newAppState === 'background') {
                if (permissionrestart) {
                    RNRestart.restart();
                    downloadJson()
                    getInstantJson()
                }
            }
        };

        AppState.addEventListener('change', handleAppStateChange);
    }, [permissionrestart])

    useEffect(() => {
        const startWork = () => {
            if (isConnected) {
                setActivityLoader(true)
                GetAllBurnerAd();
                LiveStatus()
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
            }
            try {
                await RNFS.mkdir(BurnerAd)
            } catch (error) {
                //(error.message);

            }
            try {
                await RNFS.mkdir(apkFolder)
            } catch (error) {
                //(error.message);

            }
            try {
                await RNFS.mkdir(logs)
            } catch (error) {
                //(error.message);
            }
            try {
                await RNFS.mkdir(logs1)
            } catch (error) {
                //(error.message);

            }
            try {
                await RNFS.mkdir(offline)
            } catch (error) {
                //(error.message);

            }
            try {
                await RNFS.mkdir(JsonFile)
            } catch (error) {
                //(error.message);

            }
            try {
                await RNFS.mkdir(videoPath)
            } catch (error) {
                //(error.message);

            }
        }
        getPlatform()
        deleteAndCreateFolder().then(() => {
            if (isConnected && permissionrestart) {
                setActivityLoader(true)
                GetAllBurnerAd();
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
            getNetworkBandwidth();
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
            setSpeed(networkSpeed.speed.toFixed(2))
        } catch (err) {
            ////(err);
        }
    }

    // const GetAllBurnerAd = async () => {
    //     try {
    //         const resp = await axios.get(`/api/billboard/getBurnerAdByMacId/${uniqueId}`);
    //         const data = [...resp?.data?.msg, ...resp?.data?.data];
    //         setVideoData(data);
    //         if (data?.length >= 0) {
    //             await downloadVideos(data);
    //         }
    //     } catch (error) {
    //         //('error from burner api', error);
    //         setActivityLoader(false)
    //     }

    // };
    const GetAllBurnerAd = async () => {
        try {
            const resp = await axios.get(`/api/billboard/getBurnerAdByMacId/${uniqueId}`);
            const data = [...resp?.data?.msg, ...resp?.data?.data];
            const keysArray = [];
            setVideoData(data?.map((item) => {
                const splitResult = item.Key.split('/');
                const fileName = splitResult.pop();
                keysArray.push(fileName);
            }));
            const videoFiles = await findBurner();
            if (data?.length > 0) {
                const commonVideoNames = keysArray.filter(name => videoFiles.includes(name));
                const videosToDelete = videoFiles.filter(name => !keysArray.includes(name));
                if (videosToDelete?.length >= 0) {
                    await deleteVideos(videosToDelete);
                }
                const videosToDownload = keysArray.filter(name => !videoFiles.includes(name) && !commonVideoNames.includes(name));
                if (videosToDownload.length >= 0) {
                    await downloadVideos(data, videosToDownload);
                }
            }
        } catch (error) {
            setActivityLoader(false);
        }
    };


    const deleteVideos = async (videosToDelete) => {
        try {
            const directoryPath = RNFS.DownloadDirectoryPath + '/DeviceData' + '/burnerAd';
            for (const videoName of videosToDelete) {
                const filePath = `${directoryPath}/${videoName}`;
                await RNFS.unlink(filePath);
                //('video deleted', filePath);
            }
            // Skip findBurnerVideo if not needed
        } catch (error) {
            console.error('Error deleting videos:', error);
        }
    };
    const [findburnerinside, setFindBurnerInside] = useState([])

    const findBurner = async () => {
        try {
            const directoryPath = RNFS.DownloadDirectoryPath + '/DeviceData' + '/burnerAd';
            const files = await RNFS.readdir(directoryPath);
            setFindBurnerInside(files);
            //('video inside', findburnerinside);
            return files;
        } catch (error) {
            console.error(error);
        }
    };

    const downloadVideos = async (data) => {
        try {
            const filesInFolder = await RNFS.readdir(`${RNFS.DownloadDirectoryPath}/DeviceData/burnerAd`);
            const existingVideos = filesInFolder.map(file => file);
            const newVideosToDownload = data.filter(item => !existingVideos.includes(item.Key.split('/').pop()));
            for (const item of newVideosToDownload) {
                const url = item.s3Link || `https://s3.ap-south-1.amazonaws.com/storage.saps.one/${item.Key}`;
                const filename = url.substring(url.lastIndexOf('/') + 1);
                const destinationPath = `${RNFS.DownloadDirectoryPath}/DeviceData/burnerAd/${filename}`;
                try {
                    const response = await RNFS.downloadFile({
                        fromUrl: url,
                        toFile: destinationPath,
                        background: true,
                        discretionary: true,
                    }).promise;
                    if (response.statusCode === 200) {
                        existingVideos.push(filename);
                    } else {
                        console.error('Error downloading video:', response?.statusCode);
                    }
                } catch (error) {
                    console.error('Error downloading video:', error);
                }
            }

            findBurnerVideo();
            setActivityLoader(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const findBurnerVideo = async () => {
        const directoryPath = `${RNFS.DownloadDirectoryPath}/DeviceData/burnerAd`;
        try {
            const files = await RNFS.readdir(directoryPath);
            setBurnerAddDownload(files);
        } catch (error) {
            console.error(error);
        }
    };

    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const playNextVideo = () => {
        if (currentVideoIndex === burneradd.length - 1) {
            setCurrentVideoIndex(0);
            setIsPlaying(true);
            return;
        }
        setCurrentVideoIndex(currentVideoIndex + 1);
        setIsPlaying(true);
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
                // ////('Error taking picture:', error);
            }
        }
    };

    const clickPhoto = async (orderId, uniqueId, views) => {
        let body = {
            orderId: orderId,
            publishChannel: uniqueId,
            photo: views
        }
        try {
            const resp = await axios.post("/api/order/orderViewsImage", body)
        } catch (error) {
            //('ERROR FROM CLICK PHOTO', error.response.data.msg);
        }
    }


    //////////// PUBNUB IMPLEMENTATION /////////////

    const requestId = async (uniqueId) => {
        setChannels([uniqueId])
    }
    useEffect(() => {
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


    const handleMessage = async (event) => {
        const message = event.message;
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
                        // ////("Status Pubnub ===> ", status);
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
                // PlayPauseVideo(message)


            }
            if (message.eventname == "stop") {
                // PlayPauseVideo(message)
            }

            // if (message.eventname == "download_burner_ad") {
            //     DownloadBurnerAd(message.fileurl, message.uniquefilename, message.filetype)
            // }

            if (message.eventname == "download_apk") {
                // downloadNewVersion()

            }
            if (message.eventname == "getdevicelogs") {
                // SendLogFile()

            }
            if (message.eventname == "restartPmaApp") {
                // RestartApp()
            }

            if (message.eventname == "takePmaAppSnapshot") {
                // if (cameraVisible === false) {
                //     setCameraVisible(true)
                //     SnapShot()
                // }
            }
            if (message.eventname == 'takePmaAppScreenShot') {
                // if (screenvisible === false) {
                //     setScreenVisible(true)
                //     takeScreenShot()
                // }
            }

            if (message.eventname == 'schedule_json') {
                //('THIS IS SCHEDULE JSON');
                // setTimeout(() => {
                //     downloadJson()
                // }, 12000);
            }

            if (message.eventname === 'delete_video') {
                // const videoNames = message.data;
                // for (const videoName of videoNames) {
                //     deleteLastVideo(videoName);
                // }
            }

            if (message.eventname === 'instant_json') {
                ('THIS IS INSTANT EVENT >>>>');
                // getInstantJson()
            }
            if (scheduleJsonData && instantJsonData) {
                //('Either schedule_json or instant_json event has occurred. Merging data...');
                // readJson()
                // await mergeJsonData();
            }
            if (message.eventname === 'delete_video') {
                // DeleteVideoInternal()

            }
        }
    }

    const MERGED_DATA_KEY = 'mergedData'; // AsyncStorage key

    let scheduleJsonData = null;
    let instantJsonData = null;

    // Function to merge JSON data into the mergedData object and store it in AsyncStorage.
    const mergeJsonData = async () => {
        try {
            let mergedData = await AsyncStorage.getItem(MERGED_DATA_KEY);
            if (!mergedData) {
                mergedData = [];
            } else {
                mergedData = JSON.parse(mergedData);
            }
            if (scheduleJsonData) {
                mergedData = [...mergedData, ...scheduleJsonData];
                scheduleJsonData = null; // Reset scheduleJsonData after merging
            }
            if (instantJsonData) {
                mergedData = [...mergedData, ...instantJsonData];
                instantJsonData = null; // Reset instantJsonData after merging
            }
            await AsyncStorage.setItem(MERGED_DATA_KEY, JSON.stringify(mergedData));
        } catch (error) {
            console.error('Error merging JSON data:', error);
        }
    };

    const getInstantJson = async () => {
        try {
            const resp = await axios.get(`/api/order/scheduleAdminOrder?macId=${uniqueId}&date=${currentDate}&startHour=${currentHour}`);
            const data = resp?.data?.data;
            const video = resp?.data?.videoData;
            const videoNameData = resp?.data?.videoNameData;
            setVideoOffline(video);
            setVideoNameData(videoNameData);
            if (data) {
                instantJsonData = data;
                const filePath = `${RNFS.DownloadDirectoryPath}/DeviceData/json/Data_${timestamp}.json`;
                const jsonDataString = JSON.stringify(data);
                await RNFS.writeFile(filePath, jsonDataString, 'utf8', RNFS.FS_APPEND_FILE);
                readJson();
            } else {
                console.warn('No valid data to save to Instant JSON file.');
            }
            return data;
        } catch (error) {
            console.error('Error getting Instant JSON:', error);
            throw new Error('Error getting Instant JSON:', error);
        }
    };

    const downloadJson = async () => {
        try {
            const resp = await axios.get(`/api/order/getOfflineJSON/${uniqueId}`);
            const data = resp?.data?.data;
            const video = resp?.data?.videoData;
            const videoNameData = resp?.data?.videoNameData
            setVideoOffline(video);
            setVideoNameData(videoNameData);
            if (data) {
                scheduleJsonData = data;
                const filePath = `${RNFS.DownloadDirectoryPath}/DeviceData/json/Data_${timestamp}.json`;
                await RNFS.writeFile(filePath, JSON.stringify(data), 'utf8', RNFS.FS_APPEND_FILE);
                readJson()
            } else {
                console.warn('No valid data to save to Schedule JSON file.');
            }
            return data;
        } catch (error) {
            console.error('Error downloading JSON:', error);
            //   throw an Error('Error downloading JSON:', error);
        }
    };

    const currentDate = moment().format('YYYY-MM-DD');
    const currentHour = moment().format('H');

    ///// HANDLE OFFLINE JSON /////

    useEffect(() => {
        handleDownload();
    }, []);

    const handleDownload = async () => {
        try {
            const data = await downloadJson();
            setJsonData(data);

        } catch (error) {
            console.error('Error during download:', error);
        }
    };

    ///// HANDLE INSTANT JSON /////

    useEffect(() => {
        handleInstantDownload();
    }, []);

    const handleInstantDownload = async () => {
        try {
            const data = await getInstantJson();
            setJsonData(data);

        } catch (error) {
            console.error('Error during download:', error);
        }
    };

    const filePath = `${RNFS.DownloadDirectoryPath}/DeviceData/json/Data_${timestamp}.json`;
    const [jsonData, setJsonData] = useState([])
    const [videooffline, setVideoOffline] = useState([])

    const readJson = async () => {
        try {
            const filePath = `${RNFS.DownloadDirectoryPath}/DeviceData/json/Data_${timestamp}.json`;
            const fileContents = await RNFS.readFile(filePath, 'utf8');
            const jsonData = JSON.parse(fileContents);
            console.log('jsponnn data', jsonData);
            setJsonData(jsonData);

        } catch (error) {
            console.error('Error reading JSON file:', error);
        }
    };

    useEffect(() => {
        if (jsonData) {
            downloadVideo()
        }
    }, [jsonData, findvideo])


    var succesvideo;
    var failurevideo;

    const downloadVideo = async () => {
        const folderPath = `${RNFetchBlob.fs.dirs.DownloadDir}/DeviceData/video`;
        try {
            for (const url of videooffline) {
                const destinationPath = getVideoDestinationPath(url, folderPath);
                const fileExists = await RNFetchBlob.fs.exists(destinationPath);
                if (fileExists) {
                    findVideo();
                    videonamedata.forEach(item => {
                        if (findvideo.some(pubItem => pubItem.replace(/\.mp4$/, '') === item)) {
                            setDynamicPlay(true);
                        } else {
                        }
                    });
                    playVideo(jsonData);
                    continue;  // Skip this video and proceed to the next
                }
                try {
                    const res = await RNFetchBlob.config({
                        fileCache: true,
                        path: destinationPath,
                    }).fetch('GET', url);
                    const videoFiles = await findVideo();
                    for await (let item of videonamedata) {
                        if (videoFiles.some(pubItem => pubItem.replace(/\.(mp4|jpg|png|jpeg)$/, '') === item)) {
                            setDynamicPlay(true);
                        } else {
                            setDynamicPlay(false);
                        }
                    }
                    playVideo(jsonData);
                    succesvideo = new Date().toLocaleString()
                } catch (error) {
                    failurevideo = new Date().toLocaleString()
                    console.error('Error downloading video:', error);
                }
            }
        } catch (error) {
            console.error('Error downloading videos:', error);
            failurevideo = new Date().toLocaleString()
        }
    };


    const getVideoDestinationPath = (url, folderPath) => {
        url = url.replace("thumbnails", "fullimages").replace(".png", ".jpg");
        const filename = url.substring(url.lastIndexOf('/') + 1).replace("thumbnails", "fullimages").replace(".png", ".jpg");
        return `${folderPath}/${filename}`;
    };

    const [fileType1, setFileType1] = useState('')
    const [playfile1, setPlayFile1] = useState(true);
    const [test, setTest] = useState('')
    const imageUri = `file:///storage/emulated/0/Download/DeviceData/video/${playfile1}.jpg`;

    const getCurrentTimeInMilliseconds = () => {
        const now = new Date();
        const timeZoneOffset = now.getTimezoneOffset() * 60 * 1000; // Convert minutes to milliseconds
        const currentTime = now.getTime() - timeZoneOffset; // Adjust for time zone offset
        return currentTime;
    };

    const deleteLastVideo = async (videoNameFromPubNub) => {
        const directoryPath = `${RNFetchBlob.fs.dirs.DownloadDir}/DeviceData/video`;
        try {
            const files = await RNFS.readdir(directoryPath);
            const videoNameWithExtension = `${videoNameFromPubNub}.mp4`;
            const matchingVideo = findvideo.find((video) => video.includes(videoNameWithExtension))
            if (matchingVideo) {
                const videoPath = `${directoryPath}/${matchingVideo}`;
                await RNFS.unlink(videoPath);
            } else {
            }
        } catch (error) {
            console.error('Error reading or deleting video:', error);
        }
    };
    const [findvideo, setFindVideo] = useState([])

    const findVideo = async () => {
        try {
            const directoryPath = RNFS.DownloadDirectoryPath + '/DeviceData' + '/video';
            const files = await RNFS.readdir(directoryPath)
            setFindVideo(files)
            return files
        } catch (error) {
            console.error(error);
        }
    }


    const playVideo = async (jsonData, data) => {
        if (jsonData.length > 0) {
            let item = jsonData.pop();
            const currentTime = getCurrentTimeInMilliseconds();
            const inputTime = item?.scheduleDate;
            const time = moment(inputTime).utc();
            const hour = time.get('hour');
            const nextHour = (hour + 1) % 24;
            const period = hour < 12 ? 'am' : 'pm';
            const formattedTime = `${hour}-${nextHour}${period}`;
            //('formatted time', (Math.round(new Date(item.scheduleDate).getTime()) - currentTime) / 1000);

            if (item.fileType === 'video/mp4') {
                setTest(`video will play ${Math.round(((new Date(item.scheduleDate).getTime()) - currentTime) / 1000)} sec`);
                setTimeout(() => {
                    //('inside offline cameraa');
                    takePicture(item.orderId, uniqueId);
                }, 10000)
                const content = JSON.stringify({
                    mac_id: uniqueId,
                    orderId: item.orderId,
                    PlayTime: item.scheduleDate,
                    status: 'played',
                    downloadSuccess: succesvideo,
                    downloadFaiure: failurevideo,
                    slotTime: formattedTime,
                    mediaError: medianotsupported,
                    playStatus: dynamicplay === false ? 'Socket' : 'Offline'
                })
                try {
                    RNFS.appendFile(path1, content + '\n', 'utf8');
                    ('Text file created successfully!');
                } catch (error) {
                    ('Error creating text file:', error);
                }
                setTimeout(() => {
                    emit('playresp', { orderId: item?.orderId, mac_id: item?.macId, status: 'played', second: changeSecondDate(item), secondNew: item?.second })
                    setFileType1(item.fileType);
                    setPlayFile1(item.videoname);
                }, new Date(item.scheduleDate).getTime() - currentTime);

                setTimeout(() => {
                    setTest('');
                    setPlayFile1('');
                    setFileType1(null);
                    playVideo(jsonData);
                }, new Date(item.scheduleDate).getTime() - currentTime + 29050);
            }
            if (item.fileType === 'image/jpeg') {
                setTest(`video will play ${Math.round(((new Date(item.scheduleDate).getTime()) - currentTime) / 1000)} sec`);

                const content = JSON.stringify({
                    mac_id: uniqueId,
                    orderId: item.orderId,
                    PlayTime: item.scheduleDate,
                    status: 'played',
                    downloadSuccess: succesvideo,
                    downloadFaiure: failurevideo,
                    slotTime: formattedTime,
                    mediaError: medianotsupported
                })
                try {
                    RNFS.appendFile(path1, content + '\n', 'utf8');
                    ('Text file created successfully!');
                } catch (error) {
                    ('Error creating text file:', error);
                }
                setTimeout(() => {
                    emit('playresp', { orderId: item?.orderId, mac_id: item?.macId, status: 'played', second: changeSecondDate(item), secondNew: item?.second })
                    setFileType1(item.fileType);
                    setPlayFile1(item.videoname);
                }, new Date(item.scheduleDate).getTime() - currentTime);

                setTimeout(() => {
                    setTest('');
                    setPlayFile1('');
                    setFileType1(null);
                    playVideo(jsonData);
                }, new Date(item.scheduleDate).getTime() - currentTime + 29050);
            }
        } else {
            getInstantJson()
        }
    };


    const DeleteVideoInternal = async () => {
        try {
            const resp = await axios.get(`/api/order/getDeleteVideoList/${uniqueId}`);
            const data = resp?.data?.data?.videoNameArr;
            //('video api data', data);

            if (data && data.length > 0) {
                await Promise.all(
                    data.map(async (videoName) => {
                        const videoFileName = videoName + '.mp4';
                        const videoPath = RNFS.DownloadDirectoryPath + '/DeviceData' + '/video/' + videoFileName;

                        try {
                            await RNFS.unlink(videoPath);
                            //('Deleted video:', videoFileName);
                        } catch (error) {
                            console.error('Error deleting video:', videoFileName, error);
                        }
                    })
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

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
            //('all device info', deviceInfo?.brand);
        };

        fetchDeviceInfo();
    }, []);

    const RestartApp = () => {
        AsyncStorage.setItem('callGetAllDeviceDataAfterRestart', 'true')
            .then(() => {
                RNRestart.restart();
            })
            .catch((error) => {
                console.error('Error setting flag:', error);
            });
    }

    AsyncStorage.getItem('callGetAllDeviceDataAfterRestart')
        .then((value) => {
            if (value === 'true') {
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
    const [cameraVisible, setCameraVisible] = useState(false); // Initially, camera is hidden
    const [uriImage, setUriImage] = useState('')

    const SnapShot = async () => {
        if (cameraRef) {
            try {
                const options = {
                    base64: true
                };
                const data = await cameraRef?.current?.takePictureAsync(options);
                setUriImage(data?.uri)
                setFile(data);
                setTimeout(() => {
                    //('under useeffect');
                    handleSubmit(data?.uri);
                }, 10000)
            } catch (error) {
                //('error from camera snappp', error);
            }
        }
    }


    const handleSubmit = async (dataImage) => {
        const datas = new FormData();

        datas.append('file', {
            uri: dataImage,
            type: 'image/jpeg',
            name: 'snapshot.jpg',
        });
        try {
            let resp = await fetch(`${FETCH_URL}/api/device/saveDeviceSnapshot`,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'macid': uniqueId
                    },
                    method: 'POST',
                    body: datas
                });
            let response = await resp.json();
            //('response from snapshot', response);

        } catch (error) {
            //('ERROR FROM VIDEO UPLOAAD', error?.response?.data?.message);
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
        try {
            let resp = await fetch(`${FETCH_URL}/api/device/saveDeviceScreenshot`,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'macid': uniqueId
                    },
                    method: 'POST',
                    body: datas
                });
            let response = await resp.json();
        } catch (error) {
            //('ERROR FROM SCREENSHOT UPLOAAD', error?.response?.data?.message);
            console.error(error);

        }
    }

    const [isConnecteeed, setIsConnecteeed] = useState(true);
    const [wifiname, setWifiName] = useState('')

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    const getWifiName = async () => {
        await NetInfo.fetch().then(state => {
            setWifiName(state.details)

        });
    }

    const [data, setData] = useState('')

    const wifi = async () => {
        let list = await WifiManager.loadWifiList()
        setData(list);
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
                //("Location permission denied");
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
        try {
            const resp = await axios.post('/api/device/setAppInfo', body)
        } catch (error) {
            //('ERROR FROM ALL DEVICE API DATA', error);
        }
    }

    const SendLogFile = async () => {
        const data = new FormData();
        data.append('file', {
            files: ''
        });
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
        } catch (error) {

        }
    }

    const changeSecondDate = (data) => {
        if(data?.second){
            const convertToSeconds = moment(moment().format('HH') + ':00:00', 'HH:mm:ss').add(data?.second, 'seconds').format('HH:mm:ss');
            const getDateSeconds = moment(new Date()).format('YYYY-MM-DD') + `T${convertToSeconds}+05:30`
    
            console.log('get datsssss',getDateSeconds );
            return getDateSeconds
        }

        return data?.scheduleDate;

    }

    //////FUNCTION TO PLAY AND STOP //////////////////////

    function PlayPauseVideo(data) {
        const currentTime = moment();
        const startOfHour = moment().startOf('hour');
        const secondsFromStartOfHour = currentTime.diff(startOfHour, 'seconds');
        const DifferenceTime = secondsFromStartOfHour - data.second
        let orderId = data?.orderId;
        setorderId2(orderId);
        let second = changeSecondDate(data);
        setsecond2(second);
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

                const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId, second: second, status: 'played' })
                try {
                    RNFS.appendFile(path, content + '\n', 'utf8');
                    //('Text file created successfully!');
                } catch (error) {
                    //('Error creating text file:', error);
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

                const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId, second: second, status: 'played' })
                try {
                    RNFS.appendFile(path, content + '\n', 'utf8');
                    //('Text file created successfully!');
                } catch (error) {
                    //('Error creating text file:', error);
                }
                setTimeout(() => {
                    //('inside online cameraa');
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

                const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId, second: second, status: 'played' })


                try {
                    RNFS.appendFile(path, content + '\n', 'utf8');
                    //('Text file created successfully!');
                } catch (error) {
                    //('Error creating text file:', error);
                }
                setTimeout(() => {
                    takePicture(data?.orderId, uniqueId);
                }, 10000)

            }
            if (data && data.filetype == "url") {
                setIsPlaying(false)
                setFileType(data.filetype)
                setUrl(data.filename)


                const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId, second: second, status: 'played' })


                try {
                    RNFS.appendFile(path, content + '\n', 'utf8');
                    //('Text file created successfully!');
                } catch (error) {
                    //('Error creating text file:', error);
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
            })
            .catch((error) => {
            });
    }


    //////////////////////// D-PAD FUNCTIONALIY /////////////////////////

    const handleInput1Focus = () => {
        inputRef1.current.focus();
        setFocusedButtonIndex(1);
    };


    const [focusedButtonIndex, setFocusedButtonIndex] = useState(1);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

    let focusButton = 1
    let nextIndex = focusButton;

    const handleKeyPress = (keycode) => {

        switch (keycode) {
            case 19:
                //("Left button pressed");
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
                //("Enter button pressed");
                handleButtonPress(focusedButtonIndex);
                break;
            default:
                break;
        }
    }

    const handleButtonPress = useCallback(
        (buttonIndex) => {
            //('button index', buttonIndex);
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


    useEffect(() => {
        const keyEventModule = NativeModules.KeyEventEmitter;
        const eventEmitter = new NativeEventEmitter(keyEventModule);
        const keyEventSubscription = eventEmitter.addListener('onKeyDown', (event) => {
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
        try {
            const resp = await axios.post('/api/device/isActiveDevice', body)
            setLiveStatus(resp.data.success)
        } catch (error) {

        }
    }

    const onLoad = () => {
    };

    const onError = (error) => {

        const content = JSON.stringify({ mac_id: uniqueId, eventname: "playresp", orderId: orderId2, second: second2, status: 'Media does not support' })
        try {
            RNFS.appendFile(path, content + '\n', 'utf8');
            //('Text file created successfully!');
        } catch (error) {
            //('Error creating text file:', error);
        }
        ToastAndroid.show("MEDIA DOES NOT SUPPORT", ToastAndroid.LONG, ToastAndroid.BOTTOM);
        setMediaNotSupported('Media Does Not Support')
    };

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected == false) {
                // //('is connected condition inside if ', state);
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



    return (
        <View>
            {activityLoader ? (
                <View>
                    <View style={style.container}>
                        <Video
                            style={{ height: '100%', width: '100%', backgroundColor: 'black' }}
                            source={require('../../assests/gif.mp4')}
                            paused={false}
                            resizeMode="contain"
                            controls={false}
                            repeat={true}
                            onLoad={onLoad}
                            onError={onError}
                            muted={false}
                        />
                    </View>


                    {videoData?.length === 0 ?
                        <View style={{ justifyContent: 'center', alignSelf: 'center', position: 'absolute', bottom: '25%', }}>
                            <Text style={{ textAlign: 'center', marginTop: 250, color: 'white', fontWeight: 'bold', fontSize: 20 }}></Text>
                        </View>
                        :
                        <View style={{ justifyContent: 'center', alignSelf: 'center', position: 'absolute', bottom: '25%', }}>
                            <Text style={{ textAlign: 'center', marginTop: 250, color: 'white', fontWeight: 'bold', fontSize: 20 }}>Initializing Media - ( {counting} Out Of {videoData?.length})</Text>
                        </View>
                    }
                </View>
            ) : (
                <View>
                    <View style={{ backgroundColor: 'black' }}>
                        {fileType === 'image/jpeg' || fileType === 'video/mp4' || fileType === 'video/webm' || fileType === 'url' ?

                            <RNCamera
                                ref={cameraRef}
                                type={'front'}
                                style={{ opacity: 0, height: '0.1%', width: '0.1%', backfaceVisibility: 'hidden', backgroundColor: 'black' }}
                                captureAudio={false}
                            // onMountError={(error) => //('Error mounting camera:', error)}
                            />
                            :
                            <RNCamera
                                ref={cameraRef}
                                type={'front'}
                                style={{ opacity: 0, height: '0.1%', width: '0.1%', backfaceVisibility: 'hidden', backgroundColor: 'black' }}
                                captureAudio={false}
                            // onMountError={(error) => //('Error mounting camera:', error)}
                            />
                        }

                        {
                            ((medianotsupported.length > 0 || dynamicplay === false) && fileType === 'video/mp4' && playfile) ?

                                <View >
                                    {platformHeader === false ?
                                        <TouchableOpacity onPress={() => setIsHeaderVisible(!isHeaderVisible)}>
                                            <Video
                                                style={style.backgroundVideo}
                                                source={{ uri: playfile }}
                                                paused={false}
                                                resizeMode="stretch"
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
                                            resizeMode="stretch"
                                            controls={false}
                                            repeat={true}
                                            onLoad={onLoad}
                                            onError={onError}
                                            muted={false}
                                        />
                                    }

                                    {isHeaderVisible && (
                                        <ImageBackground source={require('../../assests/blur.png')} style={style.headerContainer}>
                                            <Animated.View
                                                style={[
                                                    { transform: [{ translateY }] }
                                                ]}
                                            >
                                                <View style={{ flexDirection: 'row', marginLeft: 24, marginTop: 3 }}>
                                                    <Image style={{ height: 30, width: 40 }} source={require('../../assests/Group.png')} />
                                                    <Image style={{ height: 30, width: 210, marginLeft: 10 }} source={require('../../assests/header1.png')} />
                                                </View>
                                                <View style={style.innerContainer}>
                                                    <View style={style.circleContainer}>
                                                        {isConnected ? connectedCircle : disconnectedCircle}
                                                    </View>
                                                    <TouchableOpacity onFocus={handleInput1Focus}>
                                                        {renderButton(1, '', require('../../assests/setting.png'))}
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
                                (fileType1 === 'video/mp4' && playfile1) ?
                                    <View>
                                        {platformHeader === false ?
                                            <TouchableOpacity onPress={() => setIsHeaderVisible(!isHeaderVisible)}>
                                                <Video
                                                    style={style.backgroundVideo}
                                                    source={{ uri: `/storage/emulated/0/Download/DeviceData/video/${playfile1}.mp4` }}
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
                                                source={{ uri: `/storage/emulated/0/Download/DeviceData/video/${playfile1}.mp4` }}
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
                                            <ImageBackground source={require('../../assests/blur.png')} style={style.headerContainer}>
                                                <Animated.View
                                                    style={[
                                                        { transform: [{ translateY }] }
                                                    ]}
                                                >
                                                    <View style={{ flexDirection: 'row', marginLeft: 24, marginTop: 3 }}>
                                                        <Image style={{ height: 30, width: 40 }} source={require('../../assests/Group.png')} />
                                                        <Image style={{ height: 30, width: 210, marginLeft: 10 }} source={require('../../assests/header1.png')} />
                                                    </View>
                                                    <View style={style.innerContainer}>
                                                        <View style={style.circleContainer}>
                                                            {isConnected ? connectedCircle : disconnectedCircle}
                                                        </View>
                                                        <TouchableOpacity onFocus={handleInput1Focus}>
                                                            {renderButton(1, '', require('../../assests/setting.png'))}
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
                                    ((medianotsupported.length > 0 || dynamicplay === false) && fileType === 'image/jpeg' && playImage) ?
                                        <View>
                                            {platformHeader === false ?
                                                <TouchableOpacity onPress={() => setIsHeaderVisible(!isHeaderVisible)}>
                                                    <Image style={style.backgroundVideo} source={{ uri: playImage }} paused={false} resizeMode="contain" onLoad={onLoad} onError={onError} />
                                                </TouchableOpacity>
                                                :
                                                <Image style={style.backgroundVideo} source={{ uri: playImage }} paused={false} resizeMode="contain" onLoad={onLoad} onError={onError} />
                                            }
                                            {isHeaderVisible && (
                                                <ImageBackground source={require('../../assests/blur.png')} style={style.headerContainer}>
                                                    <Animated.View
                                                        style={[

                                                            { transform: [{ translateY }] }
                                                        ]}
                                                    >

                                                        <View style={{ flexDirection: 'row', marginLeft: 24, marginTop: 3 }}>
                                                            <Image style={{ height: 30, width: 40 }} source={require('../../assests/Group.png')} />
                                                            <Image style={{ height: 30, width: 210, marginLeft: 10 }} source={require('../../assests/header1.png')} />
                                                        </View>
                                                        <View style={style.innerContainer}>
                                                            <View style={style.circleContainer}>
                                                                {isConnected ? connectedCircle : disconnectedCircle}
                                                            </View>
                                                            <TouchableOpacity onFocus={handleInput1Focus}>
                                                                {renderButton(1, '', require('../../assests/setting.png'))}
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

                                        (fileType1 === 'image/jpeg' && playfile1) ?
                                            <View>
                                                {platformHeader === false ?
                                                    <TouchableOpacity onPress={() => setIsHeaderVisible(!isHeaderVisible)}>
                                                        <Image style={style.backgroundVideo} source={{ uri: imageUri }} paused={false} resizeMode="contain" onLoad={onLoad} onError={onError} />
                                                    </TouchableOpacity>
                                                    :
                                                    <Image style={style.backgroundVideo} source={{ uri: imageUri }} paused={false} resizeMode="contain" onLoad={onLoad} onError={onError} />
                                                }
                                                {isHeaderVisible && (
                                                    <ImageBackground source={require('../../assests/blur.png')} style={style.headerContainer}>
                                                        <Animated.View
                                                            style={[

                                                                { transform: [{ translateY }] }
                                                            ]}
                                                        >

                                                            <View style={{ flexDirection: 'row', marginLeft: 24, marginTop: 3 }}>
                                                                <Image style={{ height: 30, width: 40 }} source={require('../../assests/Group.png')} />
                                                                <Image style={{ height: 30, width: 210, marginLeft: 10 }} source={require('../../assests/header1.png')} />
                                                            </View>
                                                            <View style={style.innerContainer}>
                                                                <View style={style.circleContainer}>
                                                                    {isConnected ? connectedCircle : disconnectedCircle}
                                                                </View>
                                                                <TouchableOpacity onFocus={handleInput1Focus}>
                                                                    {renderButton(1, '', require('../../assests/setting.png'))}
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
                                                <View>
                                                    {platformHeader === false ?
                                                        <TouchableOpacity onPress={() => setIsHeaderVisible(!isHeaderVisible)}>
                                                            <Video style={style.backgroundVideo} source={{ uri: webm }} paused={false} resizeMode="contain" controls={false} repeat={true} muted={false} onError={onError} />
                                                        </TouchableOpacity>
                                                        :
                                                        <Video style={style.backgroundVideo} source={{ uri: webm }} paused={false} resizeMode="contain" controls={false} repeat={true} muted={false} onError={onError} />

                                                    }
                                                    {isHeaderVisible && (
                                                        <ImageBackground source={require('../../assests/blur.png')} style={style.headerContainer}>
                                                            <Animated.View
                                                                style={[

                                                                    { transform: [{ translateY }] }
                                                                ]}
                                                            >

                                                                <View style={{ flexDirection: 'row', marginLeft: 24, marginTop: 3 }}>
                                                                    <Image style={{ height: 30, width: 40 }} source={require('../../assests/Group.png')} />
                                                                    <Image style={{ height: 30, width: 210, marginLeft: 10 }} source={require('../../assests/header1.png')} />
                                                                </View>
                                                                <View style={style.innerContainer}>
                                                                    <View style={style.circleContainer}>
                                                                        {isConnected ? connectedCircle : disconnectedCircle}
                                                                    </View>
                                                                    <TouchableOpacity onFocus={handleInput1Focus}>
                                                                        {renderButton(1, '', require('../../assests/setting.png'))}
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
                                                ((burneradd.length > 0 && isPlaying && livestatus) || isConnected === false) ?
                                                    <View>
                                                        <View>
                                                            {platformHeader === false ?
                                                                <TouchableOpacity onPress={() => navigation.navigate('Settings1', { uniqueId: uniqueId })}>
                                                                    <Video
                                                                        ref={videoRef}
                                                                        style={style.backgroundVideo}
                                                                        source={{
                                                                            uri: `file:///storage/emulated/0/Download/DeviceData/burnerAd/${burneradd[currentVideoIndex]}`,
                                                                        }}
                                                                        paused={!isPlaying}
                                                                        resizeMode="stretch"
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
                                                                    resizeMode="stretch"
                                                                    controls={false}
                                                                    repeat={burneradd.length === 1 ? true : false}
                                                                    onEnd={playNextVideo}
                                                                    autoplay={true}
                                                                    muted={false}
                                                                    onError={onError}
                                                                    onLoad={onLoad}
                                                                />
                                                            }
                                                        </View>

                                                        {isHeaderVisible && (
                                                            <ImageBackground source={require('../../assests/blur.png')} style={style.headerContainer}>
                                                                <Animated.View
                                                                    style={[

                                                                        { transform: [{ translateY }] }
                                                                    ]}
                                                                >

                                                                    <View style={{ flexDirection: 'row', marginLeft: 24, marginTop: 3 }}>

                                                                        <Image style={{ height: 30, width: 40 }} source={require('../../assests/Group.png')} />
                                                                        <Image style={{ height: 30, width: 210, marginLeft: 10 }} source={require('../../assests/header1.png')} />

                                                                    </View>
                                                                    <View style={style.innerContainer}>
                                                                        <View style={style.circleContainer}>
                                                                            {isConnected ? connectedCircle : disconnectedCircle}
                                                                        </View>
                                                                        <TouchableOpacity onFocus={handleInput1Focus}>
                                                                            {renderButton(1, '', require('../../assests/setting.png'))}
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
                                                                videoId={url?.match(/v=([^&]+)/)[1]}
                                                                play={true}
                                                            />
                                                        </View>
                                                        :
                                                        <ImageBackground style={{ height: '100%', width: '100%', backgroundColor: 'black', }}>
                                                            <StatusBar hidden={true} />
                                                            {isHeaderVisible && (
                                                                <ImageBackground source={require('../../assests/blur.png')} style={style.headerContainer1}>
                                                                    <Animated.View
                                                                        style={[

                                                                            { transform: [{ translateY }] }
                                                                        ]}
                                                                    >

                                                                        <View style={{ flexDirection: 'row', marginLeft: 24, marginTop: 13 }}>
                                                                            <Image style={{ height: 30, width: 40 }} source={require('../../assests/Group.png')} />
                                                                            <Image style={{ height: 30, width: 210, marginLeft: 10 }} source={require('../../assests/header1.png')} />
                                                                        </View>
                                                                        <View style={style.innerContainer}>
                                                                            {/* <View style={style.circleContainer}>
                                                                    {isConnected ? connectedCircle : disconnectedCircle}
                                                                </View> */}
                                                                            <TouchableOpacity onFocus={handleInput1Focus}>
                                                                                {renderButton(1, '', require('../../assests/setting.png'))}
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </Animated.View>
                                                                </ImageBackground>
                                                            )}
                                                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 20, marginRight: 50 }}>

                                                                {isConnected ?
                                                                    <Text style={{ color: 'white', marginRight: 20 }}>{speed} Mbps</Text>
                                                                    :
                                                                    <Text style={{ color: 'white', marginRight: 20 }}>0 Mbps</Text>
                                                                }
                                                                <View style={{ marginRight: 20 }}>
                                                                    {isConnected ? connectedCircle : disconnectedCircle}
                                                                </View>

                                                            </View>
                                                            <TouchableOpacity onPress={() => navigation.navigate('Settings1', { uniqueId: uniqueId })}>

                                                                <Video
                                                                    style={{ height: '100%', width: '100%' }}
                                                                    source={require('../../assests/gif.mp4')}
                                                                    paused={false}
                                                                    resizeMode="contain"
                                                                    controls={false}
                                                                    repeat={true}
                                                                    onLoad={onLoad}
                                                                    onError={onError}
                                                                    muted={false}
                                                                />
                                                            </TouchableOpacity>

                                                            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                                                {!livestatus ?
                                                                    <View style={{ bottom: moderateScaleVertical(180), borderWidth: 1, borderColor: 'white' }}>
                                                                        <QRCode
                                                                            value={uniqueId}
                                                                            size={moderateScale(50)}
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
                    </View>
                </View>
            )}
        </View>
    )
}


export default PortraitScreen;

const style = StyleSheet.create({
    backgroundVideo: {
        height: '100%',
        // width: '100%',
        backgroundColor: 'black',
    },
    container: {
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
        tintColor: 'white'
    },
    focusedButton: {
        backgroundColor: 'rgba(183,54,248,255)',
        width: 25,
        height: 25,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(183,54,248,255)',
        bottom: 1,
        elevation: 4,
        right: 20,
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
        alignSelf: 'center',
        height: 40,
        width: '100%',
        borderRadius: 2,
        top: 0,
        position: 'absolute',

    }
})






