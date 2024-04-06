import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, StatusBar, Animated, Platform, PermissionsAndroid, ImageBackground, TouchableOpacity, ToastAndroid, Dimensions, NativeEventEmitter, NativeModules, } from 'react-native'
import { RNCamera } from "react-native-camera";
import axios from "axios";
import { usePubNub } from "pubnub-react";
import Video from "react-native-video";
import RNFS from 'react-native-fs'
import moment from "moment";
import RNFetchBlob from "rn-fetch-blob";
import { measureConnectionSpeed } from 'react-native-network-bandwith-speed';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from "react-native-qrcode-svg";
import YoutubeIframe from "react-native-youtube-iframe";




const PortraitScreen = ({ route, navigation }) => {

    const { uniqueId } = route.params
    const cameraRef = useRef(null)
    const [views, setViews] = useState('')
    const pubnub = usePubNub();
    const [channels, setChannels] = useState([]);
    const [playfile, setPlayFile] = useState(true);
    const [playImage, setPlayImage] = useState('')
    const [fileType, setFileType] = useState('')
    const [webm, setWebm] = useState('')
    const [hasPermission, setHasPermission] = useState(null);
    const [isConnected, setIsConnected] = useState(true);
    const [speed, setSpeed] = useState('')
    const [url, setUrl] = useState('')
    const [burneradd, setBurnerAddDownload] = useState([])
    const [burneradplay, setBurnerPlay] = useState('')
    const [livestatus, setLiveStatus] = useState('')
    const [stopBurner, setStopBurner] = useState(false)
    const [firstTimePlay, setFirstTimePlay] = useState(true)

    const folderPath = RNFS.DownloadDirectoryPath + '/DeviceData'
    const BurnerAd = folderPath + '/burnerAd'
    const Downloaded = folderPath + '/downloaded'
    const videoPath = folderPath + '/video';
    const imagePath = folderPath + '/image'
    const timestamp = moment().format('YYYY-MM-DD');
    const fileName = `Data_${timestamp}.json`;
    const jsonPath = folderPath + `/${fileName}`;
    const curDate = moment().format('YYYY-MM-DD')
    // const curDate1 = moment(moment().format('YYYY-MM-DD')).add(1, 'days').fo
    const connectedCircle = <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'green' }} />;
    const disconnectedCircle = <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red' }} />;


    const translateX = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    const textWidth = useRef(0);

    useEffect(() => {
        const startAnimation = () => {
            Animated.timing(translateX, {
                toValue: -textWidth.current,
                duration: 15000, // Adjust the duration to make it slower
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    translateX.setValue(Dimensions.get('window').width);
                    startAnimation();
                }
            });
        };

        startAnimation();
    }, [translateX]);

    const handleTextLayout = (e) => {
        textWidth.current = e.nativeEvent.layout.width;
    };


    useEffect(() => {
        return () => {
            AsyncStorage.setItem('orientationPreference', 'landscape');
        };
    }, []);

    //////////////////////// D-PAD FUNCTIONALIY /////////////////////////

    const [focusedButtonIndex, setFocusedButtonIndex] = useState(0);
    // console.log('value changeeee', focusedButtonIndex);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

    let focusButton = 1

    let nextIndex = focusButton;
    const navigate = (direction) => {
        console.log('Key pressed:', direction);

        switch (direction) {
            case 19:
                nextIndex = 1

                break;
            case 20:
                nextIndex = 1
                break;
            case 21:
                nextIndex = 1
                break;
            case 22:
                nextIndex = 1;
                break;
            case 23:
                console.log("Select button pressed");
                break;
            case 4:
                if (navigation && navigation.goBack) {
                    navigation.goBack();
                }
                break;
            default:
                break;
        }


        if (nextIndex >= 1 && nextIndex <= 9) {
            setFocusedButtonIndex(nextIndex);
        }
    };


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
                onPress={() => setFocusedButtonIndex(index)}
                activeOpacity={1}
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
            console.log('Key pressed:', event.keyCode);
            console.log('Event:', event); // Log the entire event object
            navigate(event.keyCode);
        });

        return () => {
            keyEventSubscription.remove();
        };
    }, []);



    const getNetworkBandwidth = async () => {
        try {
            const networkSpeed = NetworkBandwidthTestResults = await measureConnectionSpeed();
            // //console.log('Internet Speed', networkSpeed.speed.toFixed(2)); // Network bandwidth speed 
            setSpeed(networkSpeed.speed.toFixed(2))
        } catch (err) {
            //console.log(err);
        }
    }
    useEffect(() => {
        const intervalId = setInterval(() => {
            getNetworkBandwidth();
        }, 5000); // measure the network speed every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    ////// CAMERA FUNCTIONALITY ////////

    useEffect(() => {
        const requestPermissions = async () => {
            if (Platform.OS === 'android') {
                const { CAMERA, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE } = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);

                if (CAMERA === PermissionsAndroid.RESULTS.GRANTED) {
                    setHasPermission(true);
                } else {
                    setHasPermission(false);
                }
            } else {
                const { status } = await Camera.requestPermissionsAsync();
                if (status === 'granted') {
                    setHasPermission(true);
                } else {
                    setHasPermission(false);
                }
            }
        };

        requestPermissions();
    }, []);

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
        pubnub.addListener({
            status: function (statusEvent) {
                if (statusEvent.category === "PNNetworkDownCategory") {
                    pubnub.reconnect()
                }
                if (statusEvent.category === "PNConnectedCategory") {
                }
                if (statusEvent.category === "PNNetworkUpCategory") {
                } else {
                }
            },
            category: function (e) {
                // //console.log(e.category === "PNNetworkDownCategory");
            }, message: handleMessage
        });

        pubnub.subscribe({ channels })
    }, [pubnub, channels])

    const handleMessage = async (event) => {
        const message = event.message;
        // setLiveStatus(message?.eventname)

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

        if (message.eventname == "get_device_file") {
            sendFileToPubnub(message.filetype)

        }
        if (message.eventname == "delete_user_file") {
            deleteFiles(message.uniquename, message.filetype)

        }
        if (message.eventname == "play") {
            PlayPauseVideo(message)


        }
        if (message.eventname == "stop") {
            PlayPauseVideo(message)
        }
        if (message.eventname == "download_burner_ad") {
            DownloadBurnerAd(message.fileurl, message.uniquefilename, message.filetype)

        }
    }


    //////// DOWNLOAD BURDERADD VIDEOOO /////////

    const [videoData, setVideoData] = useState([]);

    const getBurnerAdVideo = async () => {
        try {
            const resp = await axios.get('/api/device/getBurnerAdsOriginalVideos');
            const data = resp.data.msg;
            setVideoData(data);
        } catch (error) {
            //console.log('Error from burner add', error);
        }
    };

    const downloadVideos = (data) => {
        data.forEach((item) => {
            const url = `https://s3.ap-south-1.amazonaws.com/storage.saps.one/${item.Key}`; // Add the appropriate protocol (http or https) here
            const filename = url.substring(url.lastIndexOf('/') + 1);
            const destinationPath = `${RNFS.DownloadDirectoryPath}/DeviceData/burnerAd/${filename}`;

            RNFS.downloadFile({
                fromUrl: url,
                toFile: destinationPath,
                background: true,
                discretionary: true,
            }).promise.then((response) => {
                console.log('Video downloaded:', response);
                findBurnerVideo()
                setStopBurner(true)
            }).catch((error) => {
                console.log('Download failed:', error);
            });
        });
    };

    useEffect(() => {
        getBurnerAdVideo();

    }, []);

    useEffect(() => {
        if (videoData.length > 0) {
            downloadVideos(videoData);
        }
    }, [videoData]);



    let globalConvert
    const changeSecondDate = (data) => {
        const convertToSeconds = moment(moment().format('HH') + ':00:00', 'HH:mm:ss').add(data.second, 'seconds').format('HH:mm:ss');
        // globalConvert = moment(moment().format('HH') + ':00:00', 'HH:mm:ss').add(data.second, 'seconds').format('mm')
        // //console.log('>>>>>>>>>>', globalConvert);
        const getDateSeconds = moment(new Date()).format('YYYY-MM-DD') + `T${convertToSeconds}+05:30`
        return getDateSeconds
    }

    let timer = null
    let getLiveLink = ''
    let FileTypeLink
    let burnerTimer = null;
    //////FUNCTION TO PLAY AND STOP //////////////////////

    function PlayPauseVideo(data) {


        const currentTime = moment();
        const startOfHour = moment().startOf('hour');
        const secondsFromStartOfHour = currentTime.diff(startOfHour, 'seconds');
        const DifferenceTime = secondsFromStartOfHour - data.second
        // console.log('secondss sssss difference ', DifferenceTime);

        //for google vision api------------------------------------------
        const orderId = data.orderId;
        const second = changeSecondDate(data);
        // clearInterval(timer)

        clearInterval(burnerTimer)
        console.log('burner timeeerrrr', burnerTimer);

        if (data.eventname == "play" && (DifferenceTime <= 25)) {
            clearCache('')
            setStopBurner(false)

            // if (data.eventname == "play") {
            getLiveLink = data.contentLink
            FileTypeLink = data.filetype
            // clearInterval(timer);
            // liveContentLink = data.contentLink
            // fileType = data.filetype

            if (data && data.filetype == "image/jpeg") {

                setWebm('')
                setPlayFile('')
                setPlayImage('')
                setBurnerPlay('')
                setFileType('')
                contentLink = data.contentLink.replace("thumbnails", "fullimages").replace('.png', '.jpg')
                const filename = contentLink.replace('thumbnails', 'fullimages').replace('.png', '.jpg')

                clearInterval(burnerTimer)
                // //console.log("Image name ==> ", data.filename);

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
                setTimeout(() => {
                    takePicture(data?.orderId, uniqueId);
                }, 10000)


            }
            if (data && data.filetype == "video/mp4") {

                setWebm('')
                setPlayFile('')
                setPlayImage('')
                setFileType('')
                setBurnerPlay('')
                clearInterval(burnerTimer)
                // //console.log("Image name ==> ", data.filename);
                contentLink = data.contentLink.replace("compressedVideos", "originalVideos")
                const filename = contentLink.replace('compressedVideos', 'originalVideos')


                // //console.log("//=== Yes Image exist ===//")
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
                        // //console.log("Status Pubnub ===> ", status);
                    }
                );
                setTimeout(() => {
                    takePicture(data?.orderId, uniqueId);
                }, 10000)


            }
            if (data && data.filetype == "video/webm") {

                setWebm('')
                setPlayFile('')
                setPlayImage('')
                setBurnerPlay('')
                setFileType('')
                clearInterval(burnerTimer)
                // //console.log("Image name ==> ", data.filename);
                contentLink = data.contentLink.replace("compressedVideos", "originalVideos")
                const filename = contentLink.replace('compressedVideos', 'originalVideos')

                // //console.log("//=== Yes Image exist ===//")
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
                setTimeout(() => {
                    takePicture(data?.orderId, uniqueId);
                }, 10000)

            }
            if (data && data.filetype == "url") {
                clearInterval(burnerTimer)
                setFileType(data.filetype)
                setBurnerPlay('')
                // //console.log("Video link ==> ", data.filename);
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

                setTimeout(() => {
                    takePicture(data?.orderId, uniqueId);
                }, 10000)

            }
        }

        else if (data.eventname == "stop" && (DifferenceTime <= 25)) {

            getLiveLink = ''
            // findBurnerVideo().then(() => {
            setFileType('')
            setBurnerPlay('')
            console.log('inside burner add >>>');
            if (burneradd.length > 0) {

                const random = Math.floor(Math.random() * burneradd.length)
                console.log('randommmm videooo', random);
                setFileType('burnerad/mp4')
                setBurnerPlay(burneradd[random])
                setStopBurner(true)

            } else {

                clearCache('')
                setWebm('')
                setPlayFile('')
                setPlayImage('')
                setFileType('')
            }
            // })
        }

    }




    useEffect(() => {
        console.log('burrer add lenght', burneradd.length);
        if ((!isConnected || stopBurner) && burneradd.length > 0) {

            burnerTimer = setInterval(() => {
                setFirstTimePlay(false)
                setBurnerPlay('');
                setFileType('');
                // findBurnerVideo().then(() => {
                console.log('inside burner add >>>');
                if (burneradd.length > 0) {
                    const random = Math.floor(Math.random() * burneradd.length);
                    console.log('random video', random);
                    setFileType('burnerad/mp4');
                    setBurnerPlay(burneradd[random]);
                } else {
                    clearCache('');
                    setWebm('');
                    setPlayFile('');
                    setPlayImage('');
                    setFileType('');
                    // clearInterval(burnerTimer);
                }
                // });
            }, 30000);
        }
        return () => {
            clearInterval(burnerTimer); // Clear interval on component unmount
            console.log('clear interval burnr useeffect', burnerTimer);
        };
    }, [isConnected, stopBurner, firstTimePlay]);


    /////// DOWNLOAD BURNER ADD FUNCTION ///////////////

    const DownloadBurnerAd = async (fileurl, uniquefilename, filetype) => {
        //console.log('download burner asdd', fileurl, uniquefilename, filetype);

        const folderPath = `${RNFS.DownloadDirectoryPath}/DeviceData/burnerAd`

        if (filetype === 'video/mp4') {
            fileurl = fileurl.replace("videoszip", "originalvideos").replace('.zip', '.mp4');
            const filename = fileurl.substring(fileurl.lastIndexOf('/') + 1).replace('videoszip', 'originalvideos').replace('.zip', '.mp4');
            const filepath = `${folderPath}/${filename}`;

            RNFetchBlob.config({
                fileCache: true,
                path: filepath
            }).fetch('GET', fileurl)
                .then((res) => {
                    // //console.log('VIDEO DOWNLOADED FROM PUBNUB', res);
                    findBurnerVideo().then(() => {
                        pubnub.publish(
                            {
                                channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                                message: {
                                    mac_id: uniqueId,
                                    eventname: "Downloaded",
                                    status: "Download Success",
                                    filename: uniquefilename,
                                    filetype: "video/mp4"
                                },
                                publishTimeout: 5 * 60000,
                                qos: 2
                            },
                            (status, response) => {
                                // //console.log("Status Pubnub ===> ", status);
                            }
                        );
                    })


                }).catch((error) => {
                    //console.log('ERROR FROM DOWNLOADING', error);
                })

        }


    }




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



    ///// FIND BURNER ADD VIDEO ./////

    const findBurnerVideo = async () => {
        const directoryPath = RNFS.DownloadDirectoryPath + '/DeviceData' + '/burnerAd';
        await RNFS.readdir(directoryPath)
            .then((files) => {
                console.log('VIDEO FILESS OR BURNER ADDDDD', files);
                setBurnerAddDownload(files)
            })
            .catch((error) => {
                console.error(error);
            });
    }





    ////////// TO CREATE FOLDER INTERNALLY ///////////

    useEffect(() => {

        const deleteAndCreateFolder = async () => {

            try {
                await RNFS.mkdir(BurnerAd)
            } catch (error) {
                //console.log(error.message);

            }
        }
        deleteAndCreateFolder().then(() => {
            // fetchData()
        })
    }, [])

    //////  SENDING FILE NAME TO SERVER USING PUBNUB ////////

    let directoryPath
    const sendFileToPubnub = async (filetype) => {
        if (filetype === 'video/mp4' || filetype === 'video/webm') {
            directoryPath = RNFS.DownloadDirectoryPath + '/DeviceData' + '/video';

        } else if (filetype === 'image/jpeg') {
            directoryPath = RNFS.DownloadDirectoryPath + '/DeviceData' + '/image';

        }
        await RNFS.readdir(directoryPath)
            .then((files) => {
                let body = {
                    files: files,
                    deviceMacId: uniqueId,
                    fileType: filetype
                }
                //console.log('body to send data to server', body);
                try {
                    const resp = axios.post('/api/device/deviceGallery/deviceFiles', body)
                    //console.log("response from send data to pubnub ====>", resp.data)
                    pubnub.publish(
                        {
                            channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                            message: {
                                mac_id: uniqueId,
                                eventname: "resp_get_device_file",
                                status: "Get Device File Success",
                            },
                            publishTimeout: 5 * 60000
                        },
                        (status, response) => {
                            // //console.log("Status Pubnub ===> ", status);
                        }
                    );

                } catch (error) {
                    //console.log('ERROR FROM SENDING DATA TO SERVER', error);

                }
            })
            .catch((error) => {
                console.error(error);
            })



    }

    ///////// FUNCTION TO DELETE FILES FROM FOLDER USING PUBNUB ///////

    const deleteFiles = async (uniquename, filetype) => {
        const filepath = RNFS.DownloadDirectoryPath + '/DeviceData' + '/video' + `/${uniquename}`
        // //console.log('fileeeeeee pathhhhhh', filepath);
        await RNFS.unlink(filepath)
            .then(() => {
                // //console.log('File deleted');
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }

    const onLoad = () => {
        //console.log('Video is loaded and ready to be played');
    };

    const onError = (error) => {
        pubnub.publish(
            {
                channel: 'c3RvcmFnZS5zYXBzLm9uZQ==',
                message: {
                    mac_id: uniqueId,
                    eventname: "playresp",
                    orderId: orderId,
                    second: second,
                    status: "Media does not support"
                },
                qos: 2
            },
            (status, response) => {
                // //console.log("Status Pubnub ===> ", status);
            }
        );
        ToastAndroid.show("MEDIA DOES NOT SUPPORT", ToastAndroid.LONG, ToastAndroid.BOTTOM);
    };

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });
        return () => {
            unsubscribe();
        };
    }, []);


    ///////////// TO CHECK LIVE STATUS TO SHOW QR CODE ////////////

    const LiveStatus = async () => {
        let body = {
            macId: uniqueId
        }
        //console.log('response from ai status body', body);
        try {
            const resp = await axios.post('/api/device/isActiveDevive', body)
            //console.log('Response from LiveStatus Api', resp.data.success);
            setLiveStatus(resp.data.success)
        } catch (error) {
            //console.log('error from Live Status', error.response.data.msg);

        }

    }
    useEffect(() => {
        LiveStatus()
    }, [])

    const deleteAllFiles = async () => {
        try {
            const resp = await axios.get(`/api/device/getPlayMediaByMacId?macId=${uniqueId}`);
            const videos = resp?.data?.videos;

            // Extract video names from URLs
            const videoNames = videos.map((url) => {
                const parts = url.split('/');
                return parts[parts.length - 1];
            });

            // Delete each video file
            videoNames.forEach((videoName) => {
                const filePath = `${RNFS.DownloadDirectoryPath}/DeviceData/video/${videoName}`;
                deleteFile(filePath);
            });
        } catch (error) {
            console.log('Error from Delete file API:', error.response.data.msg);
        }
    };

    const deleteFile = async (filePath) => {
        try {
            await RNFS.unlink(filePath);
            console.log('File deleted successfully:', filePath);
        } catch (error) {
            // console.log('Error deleting file:', error);
        }
    };
    useEffect(() => {
        const deleteFilesAtSpecificTime = () => {
            const currentDate = new Date();
            const targetTime = new Date();
            targetTime.setHours(0);
            targetTime.setMinutes(15);
            targetTime.setSeconds(0);

            if (currentDate >= targetTime) {
                // Perform the deletion of files
                deleteAllFiles();
                clearInterval(intervalId);
            }
        };
        const intervalId = setInterval(deleteFilesAtSpecificTime, 60000); // Check every minute
        return () => {
            clearInterval(intervalId); // Clean up the interval when the component unmounts
        };
    }, []);


    return (

        <>
            {fileType === 'image/jpeg' || fileType === 'video/mp4' || fileType === 'video/webm' || fileType === 'url' ?
                <RNCamera
                    ref={cameraRef}
                    style={{ opacity: 0, height: '0.1%', width: '0.1%', backfaceVisibility: 'hidden', backgroundColor: 'black' }}
                    // style={{ height: '10%', width: '10%'}}
                    onMountError={(error) => console.log('Error mounting camera:', error)}
                />
                :
                null
            }
            {/* <View style={{ backgroundColor: 'black' }}>

                <RNCamera
                    ref={cameraRef}
                    style={{ opacity: 0, height: '0.1%', width: '0.1%', backfaceVisibility: 'hidden', backgroundColor: 'black' }}
                    // style={{ height: '10%', width: '10%', backfaceVisibility: 'hidden', backgroundColor: 'black', }}
                    onMountError={(error) => console.log('Error mounting camera:', error)}
                />
            </View> */}

            <View>
                {(fileType === 'video/mp4' && playfile) ?
                    <View style={style.container}>
                        <Video
                            style={style.backgroundVideo}
                            source={{ uri: playfile }}
                            paused={false}
                            resizeMode="contain"
                            controls={false}
                            repeat={true}
                            onLoad={onLoad}
                            onError={onError}
                        />
                        {/* <View style={style.textContainer}>
                            <QRCode
                                value={uniqueId}
                                size={100}
                            />
                        </View> */}
                        <View style={{ alignSelf: 'center', borderWidth: 1, height: 35, width: '100%', borderRadius: 5, backgroundColor: 'transparent', borderColor: 'transparent', bottom: 0, position: 'absolute', }}>
                            <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                <Text style={style.text} onLayout={handleTextLayout}>
                                    For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                </Text>
                            </Animated.View>
                        </View>
                    </View>
                    :
                    (fileType === 'image/jpeg' && playImage) ?
                        <View style={style.container}>
                            <Image style={style.backgroundVideo} source={{ uri: playImage }} paused={false} resizeMode="contain" onLoad={onLoad} onError={onError} />
                            {/* <View style={style.textContainer}>
                                <QRCode
                                    value={uniqueId}
                                    size={100}
                                />
                            </View> */}
                            <View style={{ alignSelf: 'center', borderWidth: 1, height: 35, width: '100%', borderRadius: 5, backgroundColor: 'transparent', borderColor: 'transparent', bottom: 0, position: 'absolute', }}>
                                <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                    <Text style={style.text} onLayout={handleTextLayout}>
                                        For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                    </Text>
                                </Animated.View>
                            </View>
                        </View>
                        :
                        (fileType === 'video/webm' && webm) ?
                            <View style={style.container}>
                                <Video style={style.backgroundVideo} source={{ uri: webm }} paused={false} resizeMode="contain" controls={false} repeat={true} />

                                {/* <View style={style.textContainer}>
                                    <QRCode
                                        value={uniqueId}
                                        size={100}
                                    />
                                </View> */}
                                <View style={{ alignSelf: 'center', borderWidth: 1, height: 35, width: '100%', borderRadius: 5, backgroundColor: 'transparent', borderColor: 'transparent', bottom: 0, position: 'absolute', }}>
                                    <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                        <Text style={style.text} onLayout={handleTextLayout}>
                                            For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                        </Text>
                                    </Animated.View>
                                </View>
                            </View>
                            :
                            (fileType === 'burnerad/mp4' && burneradplay) ?
                                <View style={style.container}>
                                    <Video style={style.backgroundVideo} source={{ uri: `/storage/emulated/0/Download/DeviceData/burnerAd/${burneradplay}` }} paused={false} resizeMode="contain" controls={false} repeat={true} />
                                    <View style={{ alignSelf: 'center', borderWidth: 1, height: 35, width: '100%', borderRadius: 5, backgroundColor: 'transparent', borderColor: 'transparent', bottom: 0, position: 'absolute', }}>
                                        <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                            <Text style={style.text} onLayout={handleTextLayout}>
                                                For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                            </Text>
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
                                    <ImageBackground style={{ height: '100%', width: '100%', backgroundColor: 'black', }}>
                                        <StatusBar hidden={true} />
                                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 20 }}>
                                            {isConnected ?
                                                <Text style={{ color: 'white', marginRight: 20 }}>{speed} Mbps</Text>
                                                :
                                                <Text style={{ color: 'white', marginRight: 20 }}>0 Mbps</Text>
                                            }
                                            <View style={{ marginRight: 20 }}>
                                                {isConnected ? connectedCircle : disconnectedCircle}
                                            </View>
                                            <TouchableOpacity onPress={() => navigation.navigate('Settings1')}>
                                                {/* <Image style={{ tintColor: 'white', height: 20, width: 20, marginRight: 20 }} source={require('../../assests/setting.png')} /> */}
                                                {renderButton(1, '', require('../../assests/setting.png'))}

                                            </TouchableOpacity >
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Image style={{ alignSelf: 'center' }} source={require('../../assests/logoo.png')} />
                                            <Image style={{ alignSelf: 'center' }} source={require('../../assests/01.png')} />
                                            {livestatus !== true ?
                                                <View style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'white' }}>
                                                    <QRCode
                                                        value={uniqueId}
                                                        size={100}
                                                    />
                                                </View>
                                                :
                                                null
                                            }
                                            <View style={{ alignSelf: 'center', borderWidth: 1, height: 35, width: '100%', borderRadius: 5, backgroundColor: 'transparent', borderColor: 'transparent', bottom: 0, position: 'absolute', }}>

                                                <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                                    <Text style={style.text} onLayout={handleTextLayout}>
                                                        For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                                    </Text>
                                                </Animated.View>

                                            </View>


                                            {/* <Animated.View style={[style.textContainer, { transform: [{ translateX }] }]}>
                                                <Text style={style.text} onLayout={handleTextLayout}>
                                                    For Any Query Please Contact us via hello@postmyad.ai or visit www.postmyad.ai
                                                </Text>
                                            </Animated.View> */}
                                        </View>


                                    </ImageBackground>
                }

            </View >

        </>
    )
}


// {/* <View>
// {/* Your component content */}
// <View>
//     {/* Render your video component here */}
//     <Video
//         ref={videoRef}
//         style={style.backgroundVideo}
//         source={{
//             uri: `file:///storage/emulated/0/Download/DeviceData/burnerAd/${burneradd[currentVideoIndex]}`,
//         }}
//         paused={!isPlaying}
//         resizeMode="contain"
//         controls={false}
//         repeat={false}
//         onEnd={playNextVideo}
//         autoplay={true}
//     />
// </View>
// </View> */}


export default PortraitScreen
const style = StyleSheet.create({
    backgroundVideo: {
        // flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'black'

    },
    container: {
        // flex: 1,
    },
    //   backgroundVideo: {
    //     flex: 1,
    //     width: '100%',
    //     height: '100%',
    //   },
    textContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the background color and opacity as desired
        borderWidth: 1,
        borderColor: 'white'
    },
    overlayText: {
        color: 'white',
        fontSize: 16,
    },
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {},
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white'
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
        marginTop: 18,
        tintColor: 'white'

    },
    focusedButton: {
        backgroundColor: 'green',
        width: 30,
        height: 30,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'green',
        bottom: 10
    },
    selectedButton: {
        backgroundColor: 'green',
    },
    selectedButtonText: {
        color: 'white',
    },
})
