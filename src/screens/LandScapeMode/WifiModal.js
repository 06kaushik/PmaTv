import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    Pressable,
    View,
    TextInput,
    Image,
    TouchableOpacity 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import WifiManager from 'react-native-wifi-reborn';
import Modal from 'react-native-modal';
import { COLORS } from "../../components/GlobalStyle";

export default function WifiModal1({ modalView, modalVisible, setModalVisible }) {
    const [password, setPassword] = useState('');
    console.log('password', password);
    const [connected, setConneted] = useState({ connected: false, ssid: 'S4N' });
    const [ssid, setSsid] = useState('');
    const isWep = false;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            ssid: modalView,
            password: password,
        },
    });

    const wificonnection = async (ssid, password) => {
        console.log("Inside wificonnection", ssid, password)
        try {
            const data = await WifiManager.connectToProtectedSSID(
                ssid,
                password,
                isWep,
            );
            console.log('Connected successfully!', { data });
            //   setConneted({connected: true, ssid});
        } catch (error) {
            // setConneted({connected: false, error: error.message});
            console.log('Connection failed!', { error });
        }

        try {
            const ssid = await WifiManager.getCurrentWifiSSID();
            // setSsid(ssid);
            console.log('Your current connected wifi SSID is ' + ssid);
        } catch (error) {
            // setSsid('Cannot get current SSID!' + error.message);
            console.log('Cannot get current SSID!', { error });
        }
    };

    const onSubmit = ({ ssid, password }) => {
        console.log('I wifiModal wifi Connect form ==> ', ssid, password);
        setModalVisible(!modalVisible);
        setPassword(password);
        wificonnection(ssid, password);
    };

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                hasBackdrop={true}
                backdropOpacity={0.7}
                isVisible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold', bottom: 20 }}>WiFi Name</Text>

                                <TouchableOpacity  style={{ bottom: 24, left: 20 }} onPress={() => setModalVisible(!modalVisible)}>
                                    <Image style={{ tintColor: 'white', }} source={require('../../assests/cross.png')} />
                                </TouchableOpacity >

                            </View>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={{ backgroundColor: COLORS.card, borderRadius: 15, bottom: 10, width: 250 }}>
                                        <TextInput

                                            style={{ color: 'white', paddingLeft: 20, }}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="enter wifi name"
                                            placeholderTextColor={'#9CA9C5'}
                                        />
                                    </View>
                                )}
                                name="ssid"
                            />

                            {errors.ssid && (
                                <Text style={styles.error}>This is required.</Text>
                            )}
                            <Text
                                style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                                WiFi Password
                            </Text>

                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    maxLength: 100,
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={{ backgroundColor: COLORS.card, borderRadius: 15, top: 5 }}>
                                        <TextInput
                                            style={{ color: 'white', paddingLeft: 20 }}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Password"
                                            placeholderTextColor={'#9CA9C5'}
                                        />
                                    </View>
                                )}
                                name="password"
                            />

                            {errors.password && (
                                <Text style={{ color: 'white', top: 5 }}>This is required.</Text>
                            )}
                            {/* <View style={{marginBottom: 50, marginVertical: 10}}> */}
                            <Pressable onPress={handleSubmit(onSubmit)}>
                                <View style={{ backgroundColor: 'white', height: 30, top: 15, borderRadius: 8 }}>
                                    <Text
                                        style={{ color: COLORS.card, fontWeight: 'bold', fontSize: 16, textAlign: 'center', top: 3 }}>
                                        Next
                                    </Text>
                                </View>

                            </Pressable>
                            {/* </View> */}
                            {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: COLORS.background,
        borderRadius: 20,
        padding: 45,
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
