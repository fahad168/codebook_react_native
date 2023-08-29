import React, {useState} from "react";
import {
    Image,
    View,
    Dimensions,
    TouchableOpacity
} from "react-native";
import VideosScreen from "../components/bottom_bar_screens/videos_screen";
import ProfileScreen from "../components/bottom_bar_screens/profile_screen";
import ExploreScreen from "../components/bottom_bar_screens/explore_screen";
import HomeScreen from "../components/bottom_bar_screens/home_screen";
import AddPostModal from "../components/post_components/add_post_modal";
import styles from "./bottom_bar_styles";
import { Animated } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons"
import {useNavigation} from "@react-navigation/native"
import {useSelector} from "react-redux";
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
    const { user } = useSelector((state) => state.loginReducer);
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
                        height: 50,
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
                                          color={focused ? "#FFEB3B" : '#BDBDBD'} size={45}/>
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
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({size, focused}) => (
                            <Image source={ user?.img ? { uri: user?.img } : require('../../assets/dummy_profile.png') } style={{ width: 40, height: 40, borderRadius: 50, borderWidth: 1, borderColor: 'white' }}/>
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
                    <Ionicons name="home" color={'white'} size={35}/>
                </TouchableOpacity>
            </View>
            <AddPostModal modalVisible={modalVisible} toggleModal={toggleModal}/>
        </View>
    )
}