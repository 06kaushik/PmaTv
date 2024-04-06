import React, { useState, useEffect, useContext, useRef } from "react";
import { Text, View, Image, TextInput, TouchableOpacity, NativeEventEmitter, NativeModules, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import axios from "axios";
import { ContextApi } from "../components/ContextApi";
import NetInfo from '@react-native-community/netinfo';
import { COLORS } from "../components/GlobalStyle";



const LoginScreen = ({ navigation }) => {


    const [text1, setText1] = useState('pma@gmail.com');
    const [text2, setText2] = useState('Pma@123');
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const [activeButton, setActiveButton] = useState(null);
    const [tokenInput, setTokenInput] = useState('token');
    const [token, setToken] = useState(null);
    const { login } = useContext(ContextApi);
    const [isConnected, setIsConnected] = useState(false);
    const [permissionrestart, setPermissionRestart] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [isloading, setIsLoading] = useState(false)



    const [focusedButtonIndex, setFocusedButtonIndex] = useState(1);

    const handleInput1Focus = () => {
        inputRef1.current.focus();
        setFocusedButtonIndex(1);
    };

    const handleInput2Focus = () => {
        inputRef2.current.focus();
        setFocusedButtonIndex(2);
    };


    let focusButton = 1

    let nextIndex = focusButton;
    const navigate = (direction) => {
        console.log('Key pressed:', direction);

        switch (direction) {
            case 19:
                nextIndex = nextIndex - 1;

                break;
            case 20:
                nextIndex = nextIndex + 1;
                break;
            case 21:
                nextIndex = nextIndex - 1;
                break;
            case 22:
                nextIndex = nextIndex + 1;
                console.log(nextIndex);
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

        if (nextIndex <= 1) {
            nextIndex = 1
        }
        if (nextIndex >= 3) {
            nextIndex = 3
        }

        if (nextIndex === 1) {
            inputRef1.current.focus();
        }

        if (nextIndex === 2) {
            inputRef2.current.focus();
        }



        if (nextIndex >= 1 && nextIndex <= 3) {
            setFocusedButtonIndex(nextIndex);
        }
    };


    useEffect(() => {
        const keyEventModule = NativeModules.KeyEventEmitter;
        const eventEmitter = new NativeEventEmitter(keyEventModule);

        const keyEventSubscription = eventEmitter.addListener('onKeyDown', (event) => {
            navigate(event.keyCode);
        });

        return () => {
            keyEventSubscription.remove();
        };
    }, []);

    const HandleLogin = async () => {
        setIsLoading(true)
        let body = {
            email: text1,
            password: text2
        }
        console.log('response from body', body);
        try {
            const resp = await axios.post('/api/user/testUserLogin', body)
            // console.log('response from Login Response', resp.data);
            login(resp.data.token, resp.data.user)

            setIsLoading(false)

        } catch (error) {
            console.log('error from Login Api', error.message);
            ToastAndroid.show(error.message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
            setIsLoading(false)


        }
    }

    useEffect(() => {

        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);


        });
        return () => {
            unsubscribe();
        };
    }, []);


    const HandleLogin1 = () => {
        ToastAndroid.show('Please Check Your Connection', ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }


    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' }}>
            <View style={{ borderWidth: 1, backgroundColor: COLORS.background, borderColor: '#303749', elevation: 4, alignSelf: 'center', height: 350, width: 330, borderRadius: 5 }}>
                <View style={{ marginTop: 40 }}>
                    <Image style={{ alignSelf: 'center', height: 60, width: 80 }} source={require('../assests/logoo.png')} />
                    <Image style={{ alignSelf: 'center', marginTop: 10, height: '20%', width: '50%' }} source={require('../assests/01.png')} />
                </View>
                <View style={{ bottom: 40 }}>

                    <TextInput
                        placeholder="Enter UID"
                        placeholderTextColor={'grey'}
                        style={[styles.texti, focusedButtonIndex === 1 && styles.focusedTextInput]}
                        ref={inputRef1}
                        value={text1}
                        onChangeText={setText1}
                        onFocus={handleInput1Focus} // Add onFocus event handler
                    />
                    <TextInput
                        placeholder="Enter PASS KEY"
                        placeholderTextColor={'grey'}
                        style={[styles.text2, focusedButtonIndex === 2 && styles.focusedTextInput]}
                        ref={inputRef2}
                        value={text2}
                        onChangeText={setText2}
                        onFocus={handleInput2Focus} // Add onFocus event handler
                    />

                    {isConnected ? (
                        <TouchableOpacity
                            style={[styles.button, focusedButtonIndex === 3 && styles.focusedButton]}
                            onPress={HandleLogin}
                            activeOpacity={0.8}
                        >
                            <View style={{}}>
                                {isloading && text2.length > 0 ? <ActivityIndicator size={'small'} color={'white'} style={{ left: 80 }} /> :
                                    <Text style={styles.buttonText}>Login</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.button, focusedButtonIndex === 3 && styles.focusedButton]}
                            onPress={HandleLogin1}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    )}

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    texti: {
        alignSelf: 'center',
        marginTop: 30,
        height: 40,
        width: 250,
        paddingLeft: 8,
        borderRadius: 4,
        borderColor: '#ABB4BD',
        borderWidth: 1,
        backgroundColor: '#FFF',
        color: 'black'
    },
    text2: {
        alignSelf: 'center',
        marginTop: 20,
        height: 40,
        width: 250,
        paddingLeft: 8,
        borderRadius: 4,
        borderColor: '#ABB4BD',
        borderWidth: 1,
        backgroundColor: '#FFF',
        color: 'black'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,
        paddingHorizontal: 20,
        height: 40,
        width: 250,
        borderRadius: 8,
        backgroundColor: '#8409F4',
    },
    button1: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,
        paddingHorizontal: 20,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
    },
    focusedButton: {
        borderWidth: 2,
        borderColor: 'green',
    },
    buttonText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        left: 75
    },
    focusedTextInput: {
        borderColor: '#D6C2FF',
        borderWidth: 2,
    },
    buttonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;
