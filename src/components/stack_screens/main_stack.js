import React, {useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Authentication/login";
import SignUp from "../Authentication/sign_up";
import BottomBar from "../../bottom_bar/bottom_bar";
import CommentScreen from "../post_components/comment_screen";
import {useSelector} from "react-redux";

const Root = createNativeStackNavigator()

const MainStack = (props) => {
    const isLogin = useSelector((state) => state.loginReducer.isLogin);

    const BeforeLogin = () => {
        return(
            <NavigationContainer>
                <Root.Navigator
                    initialRouteName="LoginScreen"
                    screenOptions={{
                        headerMode: "none",
                        headerShown: false,
                    }}
                >
                    <Root.Screen name='LoginScreen' component={Login} options={{animation: 'slide_from_right'}} />
                    <Root.Screen name='SignUpScreen' component={SignUp} options={{animation: 'slide_from_right'}} />
                    <Root.Screen name='BottomBar' component={BottomBar} options={{animation: 'slide_from_right'}} />
                </Root.Navigator>
            </NavigationContainer>
        )
    }

    const AfterLogin = () => {
        return(
            <NavigationContainer>
                <Root.Navigator
                    screenOptions={{
                        headerMode: "none",
                        headerShown: false,
                    }}
                >
                    <Root.Screen name='BottomBar' component={BottomBar} options={{animation: 'slide_from_right'}}  />
                    <Root.Screen name='CommentScreen' component={CommentScreen} options={{animation: 'slide_from_right'}} />
                </Root.Navigator>
            </NavigationContainer>
        )
    }

    if (isLogin === false){
        return <BeforeLogin />
    }else{
        return <AfterLogin />
    }
}

export default MainStack