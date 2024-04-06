import React, {useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from "./SplashScreen";


const Stack = createNativeStackNavigator();


export default function Layout(){

    return(
<>
<NavigationContainer>
<Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="SplashScreen" component={SplashScreen} />
</Stack.Navigator>
 </NavigationContainer>

</>


    )
}