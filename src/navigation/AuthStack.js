import React, { useRef, useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createStackNavigator } from '@react-navigation/stack';

import LoginScreen from "../screens/LoginScreen";


const Stack = createStackNavigator()

const AuthStack = () => {


    return (

        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name="Login" component={LoginScreen} />

        </Stack.Navigator>


    )
}

export default AuthStack;