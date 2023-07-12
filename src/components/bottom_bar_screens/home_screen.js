import React, {useEffect, useState} from 'react';
import {
    Image,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    Dimensions,
    SafeAreaView, Button
} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LatestPosts from "../post_components/latest_posts";
import TrendingPosts from "../post_components/trending_posts";
import Ionicons from "react-native-vector-icons/Ionicons";
import GestureRecognizer from 'react-native-swipe-gestures'
import ShowStory from "../post_components/show_story";
import {useDispatch, useSelector} from "react-redux";
import { Logout } from "../../../redux/actions/action";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Tab = createMaterialTopTabNavigator();
const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.title || route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[styles.tabItem, isFocused && styles.activeTabItem]}
                    >
                        <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const HomeScreen = () => {
    const { user } = useSelector((state) => state.loginReducer);
    const [modalVisible, setModalVisible] = useState(false)
    const [storyModalVisible, setStoryModalVisible] = useState(false)
    const [latestPosts, setLatestPosts] = useState([])
    const dispatch = useDispatch();

    const handleCloseModal = () => {
        setModalVisible(!modalVisible)
    }
    const storyStyle = {
        ...styles.storyView,
        marginLeft: modalVisible ? 0 : 75,
    };
    const handleStoryModal = () => {
        setStoryModalVisible(!storyModalVisible)
    }

    const stories = [
        { id: 1, url: require('../../../assets/splashscreen.jpg') },
        { id: 2, url: require('../../../assets/gradient.png') },
        { id: 3, url: require('../../../assets/dummy_wallpaper.jpg') },
        { id: 4, url: require('../../../assets/profile_dummy.jpg') },

    ]
    return(
        <View style={styles.mainView}>
            <Button title='Logout' onPress={() => dispatch(Logout())}></Button>
            <View style={styles.innerView}>
                <TouchableOpacity style={{ zIndex: 1 }}>
                    <View>
                        <Image source={user.img ? { uri: user.img } : require('../../../assets/dummy_profile.png')} resizeMode='contain' style={user.img ? styles.profileImage : styles.dummy}/>
                        <View style={styles.addIcon}>
                            <Ionicons name='add-circle' size={25} color='white'/>
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    modalVisible ?
                        <View style={styles.storyShowView}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity onPress={handleStoryModal}>
                                    <Image source={require('../../../assets/profile_dummy.jpg')} resizeMode='contain'
                                           style={styles.stories}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleStoryModal}>
                                    <Image source={require('../../../assets/gradient.png')} resizeMode='contain'
                                           style={styles.stories}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleStoryModal}>
                                    <Image source={require('../../../assets/splashscreen.jpg')} resizeMode='contain'
                                           style={styles.stories}/>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../../../assets/gradient.png')} resizeMode='contain'
                                           style={styles.stories}/>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../../../assets/gradient.png')} resizeMode='contain'
                                           style={styles.stories}/>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../../../assets/gradient.png')} resizeMode='contain'
                                           style={styles.stories}/>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../../../assets/gradient.png')} resizeMode='contain'
                                           style={styles.stories}/>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../../../assets/gradient.png')} resizeMode='contain'
                                           style={styles.stories}/>
                                </TouchableOpacity>
                            </ScrollView>
                        </View> :
                        ""
                }
                {
                    modalVisible ?
                        <TouchableOpacity onPress={handleCloseModal}>
                            <Ionicons name='chevron-back-outline' color='black' size={30} style={storyStyle}/>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={handleCloseModal}>
                            <Ionicons name='chevron-forward-outline' color='black' size={30} style={storyStyle}/>
                        </TouchableOpacity>
                }
            </View>
            <View style={styles.innerView1}>
                <Tab.Navigator
                    tabBar={props => <CustomTabBar {...props} />}
                    tabBarOptions={{
                        showLabel: false,
                    }}
                >
                    <Tab.Screen name="Latest" component={LatestPosts} />
                    <Tab.Screen name="Trending" component={TrendingPosts} />
                </Tab.Navigator>
            </View>
            {
                storyModalVisible ?
                <GestureRecognizer
                    onSwipeDown={handleStoryModal}
                >
                    <Modal visible={storyModalVisible} animationType='slide'>
                        <SafeAreaView style={styles.storyModalContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <ShowStory stories={stories} handleStoryModal={handleStoryModal} />
                            </View>
                        </SafeAreaView>
                    </Modal>
                </GestureRecognizer> : ""
            }
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    profileImage: {
        marginTop: 15,
        marginRight: 15,
        marginLeft: 15,
        width: 50,
        height: 50,
        borderRadius: 50,
        position: 'absolute',
    },
    dummy: {
        marginTop: 15,
        marginRight: 15,
        marginLeft: 15,
        width: 50,
        height: 50,
        borderRadius: 50,
        position: 'absolute',
        borderColor: 'black',
        borderWidth: 1
    },
    mainView: {
        flex: 1,
    },
    innerView: {
        flexDirection: 'row',
        justifyContent: "flex-start"
    },
    storyView: {
        marginTop: 20,
    },
    storyShowView: {
        flex: 1,
        marginLeft: 70,
    },
    stories: {
        marginTop: 15,
        marginLeft: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'brown',
    },
    addIcon: {
        position: 'absolute',
        marginTop: 47,
        marginLeft: 45,
        borderRadius: 10
    },
    innerView1: {
        flex: 1
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 10,
        marginTop: 25,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    activeTabItem: {
        borderBottomWidth: 3,
        borderBottomColor: 'brown',
    },
    tabLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
    },
    activeTabLabel: {
        color: 'brown',
    },
    storyModalContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
})