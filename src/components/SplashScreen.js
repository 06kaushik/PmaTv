import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';



const SplashScreen = () => {

    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Preparing For TakeOff ...');




    useEffect(() => {
        const interval = setInterval(() => {
            if (progress < 100) {
                setProgress(progress + 5);
                if (progress === 20) {
                    setLoadingText('Preparing For TakeOff ...');
                } else if (progress === 40) {
                    setLoadingText('Assembling the perfect advertisement experience...');
                } else if (progress === 60) {
                    setLoadingText('Configuring the optimal settings for your app...');
                }
            } else {
                setLoadingText('Your App is now ready to launch!');
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [progress]);

    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <Text style={{ color: '#D6C2FF', fontSize: 20 }}>{loadingText}</Text>
            <ActivityIndicator size="large" color="#D6C2FF" style={{ marginTop: 20 }} />
            <Text style={{ color: '#D6C2FF', top: 10 }}>{progress}%</Text>

            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 50, top: 250 }}>
                <Image style={{ right: 10, top: 2 }} source={require('../assests/logo.png')} />
                <Image source={require('../assests/logo1.png')} />



            </View>
        </View>

    );
};

export default SplashScreen;