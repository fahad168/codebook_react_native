import React, {useEffect, useState} from 'react';
import BottomBar from "./src/bottom_bar/bottom_bar";
import {NavigationContainer} from "@react-navigation/native";
import SplashScreen from "./src/components/splash_screen";
import { StatusBar } from 'react-native';
import MainStack from "./src/components/stack_screens/main_stack";
import {store} from "./redux/store";
import { Provider } from 'react-redux';
export default function App() {
    const [showSplash, setShowSplash] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <StatusBar backgroundColor="black" />
            <Provider store={store}>
                {
                    showSplash ? (<SplashScreen/>) : (
                        <MainStack/>
                    )
                }
            </Provider>
        </>
  );
}
