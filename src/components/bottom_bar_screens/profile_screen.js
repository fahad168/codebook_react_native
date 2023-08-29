import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import {useSelector} from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomTabBar from "../../bottom_bar/custom_tab_bar";
import Images from "../profile_screens/images";
import Videos from "../profile_screens/videos";
import Favourites from "../profile_screens/favourites";
import Shorts from "../profile_screens/shorts";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
const screen = Dimensions.get('window');
const Tab = createMaterialTopTabNavigator();

const ProfileScreen = () => {
    const { user, token } = useSelector((state) => state.loginReducer);
    const [isOpen, setIsOpen]= useState(false)
    // const focused = useIsFocused()
    // const [isLoading, setIsLoading] = useState(false)
    // const [images, setImages] = useState([])
    // const [videos, setVideos] = useState([])
    // const [isRefreshing, setIsRefreshing] = useState(false)
    // const headers = {
    //     Accept: "application/json",
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`
    // };
    //
    // useEffect(() => {
    //     if(focused || isRefreshing){
    //         getImages()
    //         getVideos()
    //     }
    // }, [focused, isRefreshing])
    //
    const handleOpen = () => {
        setIsOpen(!isOpen)
    }
    //
    // const getImages= () => {
    //     setIsLoading(true)
    //
    //     axios.get(`${Backend_Url}/users/post_images`, { headers })
    //         .then((res) => {
    //             setImages(res?.data?.post_images)
    //         })
    //         .catch((error) => {
    //         });
    //     setIsLoading(false)
    // }
    //
    // const getVideos= () => {
    //     setIsLoading(true)
    //     const headers = {
    //         Accept: "application/json",
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`
    //     };
    //
    //     axios.get(`${Backend_Url}/users/post_videos`, { headers })
    //         .then((res) => {
    //             setVideos(res?.data?.post_videos)
    //         })
    //         .catch((error) => {
    //         });
    //     setIsLoading(false)
    // }

    return(
        <View>
            <View style={styles.backgroundView}>
            </View>
            <View style={styles.userDetailView}>
                <View style={styles.userImage}>
                    <Image source={user?.img ? {uri: user?.img} : require('../../../assets/profile_dummy.jpg')}
                           resizeMode='cover' style={styles.image}/>
                </View>
                <View style={styles.usernameView}>
                    <Text style={styles.usernameText}>{user?.username}</Text>
                </View>
                <View style={styles.interestsView}>
                    <Text style={styles.interestsText}>Designer, Traveler, fooder</Text>
                </View>
                <View style={styles.postsDetails}>
                    <View>
                        <Text style={styles.count}>100</Text>
                        <Text style={styles.countText}>Posts</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.count}>100</Text>
                        <Text style={styles.countText}>Followers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.count}>100</Text>
                        <Text style={styles.countText}>Following</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.count}>100</Text>
                        <Text style={styles.countText}>Likes</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <View style={styles.personalView}>
                    <TouchableWithoutFeedback onPress={handleOpen}>
                        <View style={styles.highlights}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                <TouchableOpacity>
                                    <Ionicons name='add-circle' size={25} color='brown'
                                              style={[styles.icon, {top: 3}]}/>
                                </TouchableOpacity>
                                <Text style={styles.activeText}>Highlights</Text>
                            </View>
                            <Ionicons name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} size={30}
                                      color='brown' style={styles.icon}/>
                        </View>
                    </TouchableWithoutFeedback>
                    {
                        isOpen &&
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity>
                                <View style={styles.highlightsVideo}>
                                    <Image source={{uri: user?.img ? user?.img : ''}} resizeMode='cover'
                                           style={styles.thumbnail}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.highlightsVideo}>
                                    <Image source={{uri: user?.img ? user?.img : ''}} resizeMode='cover'
                                           style={styles.thumbnail}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.highlightsVideo}>
                                    <Image source={{uri: user?.img ? user?.img : ''}} resizeMode='cover'
                                           style={styles.thumbnail}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.highlightsVideo}>
                                    <Image source={{uri: user?.img ? user?.img : ''}} resizeMode='cover'
                                           style={styles.thumbnail}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.highlightsVideo}>
                                    <Image source={{uri: user?.img ? user?.img : ''}} resizeMode='cover'
                                           style={styles.thumbnail}/>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    }
                </View>
            </View>
            <View style={styles.postsView}>
                <Tab.Navigator
                    tabBar={props => <CustomTabBar {...props} />}
                    tabBarOptions={{
                        showLabel: false,
                    }}
                >
                    <Tab.Screen name="Images" component={Images}/>
                    <Tab.Screen name="Vidoes" component={Videos}/>
                    <Tab.Screen name="Favourites" component={Favourites}/>
                    <Tab.Screen name="Shorts" component={Shorts}/>
                </Tab.Navigator>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    backgroundView: {
        backgroundColor: 'brown',
        height: 130,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    userDetailView: {
        backgroundColor: 'white',
        height: 200,
        marginLeft: 15,
        marginRight: 15,
        bottom: 30,
        borderRadius: 10,
        elevation: 4
    },
    userImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignSelf: 'center',
        bottom: 70,
        borderWidth: 5,
        borderColor: 'white',
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignSelf: 'center',
    },
    usernameView: {
        position: 'absolute',
        alignSelf: 'center',
        top: 80,
    },
    usernameText: {
        fontWeight: 'bold',
        fontSize: 20,
        textTransform: 'capitalize',
        // color: 'brown'
    },
    interestsView: {
        alignSelf: 'center',
        bottom: 45
    },
    interestsText: {
        fontSize: 15,
        color: 'brown'
    },
    postsDetails: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        bottom: 30
    },
    count: {
        alignSelf: 'center',
        color: 'brown',
        fontWeight: 'bold',
        fontSize: 16,
    },
    countText: {
        textTransform: "uppercase",
        fontSize: 15
    },
    friendImageView: {
        borderColor: 'brown',
        borderRadius: 50,
        width: 50,
        height: 50,
        borderWidth: 2,
        left: 15,
        bottom: 5,
    },
    friendImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignSelf: "center"
    },
    personalView: {
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15,
        bottom: 30,
        borderRadius: 10,
        elevation: 4,
        top: -10
    },
    activeText: {
        padding: 12,
        fontSize: 17,
        fontWeight: 'bold',
        color: 'brown',
        paddingLeft: 0
    },
    highlights: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icon: {
      padding: 8
    },
    highlightsVideo: {
        width: 90,
        height: 140,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    postsView: {
        backgroundColor: 'white',
        height: 320,
        marginLeft: 15,
        marginRight: 15,
        bottom: 30,
        borderRadius: 10,
        elevation: 4,
        top: 10
    }
})

export default ProfileScreen