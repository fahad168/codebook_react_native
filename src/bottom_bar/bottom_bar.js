import React, {useState} from "react";
import {
    Image,
    View,
    Dimensions, TouchableOpacity, Text, Modal
} from "react-native";
import VideosScreen from "../components/bottom_bar_screens/videos_screen";
import AddPostScreen from "../components/bottom_bar_screens/add_post_screen";
import ProfileScreen from "../components/bottom_bar_screens/profile_screen";
import ExploreScreen from "../components/bottom_bar_screens/explore_screen";
import SettingScreen from "../components/bottom_bar_screens/setting_screen";
import HomeScreen from "../components/bottom_bar_screens/home_screen";
import AddPostModal from "../components/post_components/add_post_modal";
import styles from "./bottom_bar_styles";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons"
import {useNavigation} from "@react-navigation/native"
import GestureRecognizer from "react-native-swipe-gestures";
const Tab = createBottomTabNavigator()
const screenWidth = Dimensions.get('window').width;
const navWidth = screenWidth - 70

const AddPost = () => {
    return null
}

export default function BottomBar() {
    const navigation = useNavigation();
    const [isPressed, setIsPressed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isHide, setIsHide] = useState(false);
    const openModal = () => {
        navigation.navigate('AddPost');

    };
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handlePress = () => {
        setIsPressed(!isPressed);
    }

    const containerStyle = {
        ...styles.circle,
    };

    return (
        <View style={styles.mainView}>
            <Tab.Navigator
                initialRouteName="HomeScreen"
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "#212121",
                        left: screenWidth - navWidth,
                        borderTopLeftRadius: 50,
                        borderBottomLeftRadius: 50,
                        marginBottom: 5,
                        position: 'absolute',
                        width: navWidth,
                        height: 60,
                        borderColor: 'white',
                        borderRightWidth: 0,
                        borderTopWidth: 3,
                    },
                }}
            >
                <Tab.Screen
                    name="Explore"
                    component={ExploreScreen}
                    options={{
                        tabBarIcon: ({size, focused}) => (
                            <Ionicons name={focused ? 'airplane' : 'airplane-outline'}
                                      color={focused ? "#FFEB3B" : '#BDBDBD'} size={size}/>
                        ),
                        tabBarLabel: "Home",
                        tabBarActiveTintColor: "#FFEB3B",
                        tabBarInactiveTintColor: "#BDBDBD",
                    }}
                />
                <Tab.Screen
                    name="Videos"
                    component={VideosScreen}
                    options={{
                        tabBarIcon: ({size, focused}) => (
                            <Ionicons name={focused ? 'tv' : 'tv-outline'}
                                      color={focused ? '#FFEB3B' : '#BDBDBD'} size={size}/>
                        ),
                        tabBarLabel: "Completed",
                        tabBarActiveTintColor: "#FFEB3B",
                        tabBarInactiveTintColor: '#BDBDBD',
                    }}
                />
                <Tab.Screen
                    name="Add"
                    component={AddPost}
                    options={{
                        tabBarIcon: ({size, focused}) => (
                            <TouchableOpacity onPress={toggleModal}>
                                <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'}
                                          color={focused ? "#FFEB3B" : '#BDBDBD'} size={50}/>
                            </TouchableOpacity>
                        ),
                        animationEnabled: true,
                        tabBarLabel: "Home",
                        tabBarActiveTintColor: "#FFEB3B",
                        tabBarInactiveTintColor: "#BDBDBD",
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({size, focused}) => (
                            <Ionicons name={focused ? 'person' : 'person-outline'}
                                      color={focused ? '#FFEB3B' : '#BDBDBD'} size={size}/>
                        ),
                        tabBarLabel: "Completed",
                        tabBarActiveTintColor: "#FFEB3B",
                        tabBarInactiveTintColor: "#BDBDBD",
                    }}
                />
                <Tab.Screen
                    name="Setting"
                    component={SettingScreen}
                    options={{
                        tabBarIcon: ({size, focused}) => (
                            <Ionicons name={focused ? 'hammer' : 'hammer-outline'}
                                      color={focused ? '#FFEB3B' : '#BDBDBD'} size={size}/>
                        ),
                        tabBarLabel: "Completed",
                        tabBarActiveTintColor: "#FFEB3B",
                        tabBarInactiveTintColor: "#BDBDBD",
                    }}
                />
                <Tab.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
                        tabBarItemStyle: {
                            display: 'none'
                        }
                    }}
                />
            </Tab.Navigator>
            <View style={containerStyle}>
                <TouchableOpacity style={styles.codeHome} onPress={() => {
                    navigation.navigate('HomeScreen');
                    handlePress()
                }}>
                    <Ionicons name="home" color={'white'} size={40}/>
                </TouchableOpacity>
            </View>
            <AddPostModal modalVisible={modalVisible} toggleModal={toggleModal}/>
        </View>
    )
}