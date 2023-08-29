import React, {useEffect, useState} from 'react';
import {
    Image,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView, Button, TouchableWithoutFeedback
} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Modal from 'react-native-modal'
import LatestPosts from "../post_components/latest_posts";
import TrendingPosts from "../post_components/trending_posts";
import Ionicons from "react-native-vector-icons/Ionicons";
import ShowStory from "../post_components/show_story";
import {useDispatch, useSelector} from "react-redux";
import { Logout } from "../../../redux/actions/action";
import * as ImagePicker from "expo-image-picker";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import { Backend_Url } from '@env'
import axios from "axios";
import Toast from "react-native-simple-toast";

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
    const { user, token } = useSelector((state) => state.loginReducer);
    const [modalVisible, setModalVisible] = useState(false)
    const [storyModalVisible, setStoryModalVisible] = useState(false)
    const [storyPicker, setStoryPicker] = useState(false)
    const [otherUserStoryModal, setOtherUserStoryModal] = useState(false)
    const [currentUserStories, setCurrentUserStories] = useState([])
    const [otherStories, setOtherStories] = useState([])
    const [otherSingleUserStories, setOtherSingleUserStories] = useState([])
    const [image, setImage] = useState([]);
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const homeFocused = useIsFocused()
    const headers = {
        Accept: "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        if (homeFocused){
            getCurrentUserStories()
            otherUserStories()
        }
    }, [homeFocused]);

    const getCurrentUserStories = () => {
        axios
            .get(`${Backend_Url}/stories` , {headers})
            .then((res) => {
                setCurrentUserStories(res?.data?.stories)
            })
            .catch((error) => console.log(error));
    }

    const otherUserStories = () => {
        axios
            .get(`${Backend_Url}/stories/other_user_stories` , {headers})
            .then((res) => {
                setOtherStories(res?.data)
            })
            .catch((error) => console.log(error));
    }

    const selectStoryPic = async (key) => {
        let result
        setImage([])
        if (key === 'select'){
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
                allowsEditing: true,
            });
        }else if(key === 'take'){
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            });
        }

        if (!result.canceled) {
            image.push(result)
            setStoryPicker(false)
            setStoryModalVisible(false)
            navigation.navigate('AddStoryScreen', { image: image })
        }else{
            console.log('canceled')
        }
    }

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

    const handleStoryPicker = () => {
        setStoryPicker(!storyPicker)
    }

    const handleOtherUserStoryModal = () => {
        setOtherUserStoryModal(!otherUserStoryModal)
    }

    const setUserStories = (stories) => {
        setOtherSingleUserStories(stories)
    }

    return(
        <View style={styles.mainView}>
            <Button title='Logout' onPress={() => dispatch(Logout())}></Button>
            <View style={styles.innerView}>
                <TouchableOpacity style={{ zIndex: 1 }} onPress={currentUserStories.length !== 0 ? handleStoryModal : handleStoryPicker}>
                    <View>
                        <Image source={user?.img ? { uri: user?.img } : require('../../../assets/dummy_profile.png')} resizeMode='contain' style={user?.img ? [{ borderColor: currentUserStories !== [] ? 'brown' : 'black' } ,styles.profileImage] : [ { borderColor: currentUserStories !== [] ? 'brown' : 'black' } ,styles.dummy]}/>
                        <View style={styles.addIcon}>
                            <Ionicons name='add-circle' size={25} color='white'/>
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    modalVisible ?
                        <View style={styles.storyShowView}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                    otherStories?.other_user_stories?.map((story) => (
                                        <TouchableOpacity onPress={() => {setUserStories(story?.stories); handleOtherUserStoryModal()}}>
                                            <Image source={{ uri: story?.stories[0]?.user?.profile_image}} resizeMode='contain'
                                                   style={styles.stories}/>
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>
                        </View> : ""
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
            <Modal style={{margin: 0}}
                   isVisible={currentUserStories.length !== 0 ? storyModalVisible : storyPicker}
                   animationIn={"slideInUp"}
                   onSwipeComplete={currentUserStories.length !== 0 ? handleStoryModal : handleStoryPicker}
                   swipeDirection={'down'}
                   swipeThreshold={100}
                   backdropColor='transparent'
                   hasBackdrop={true}
                   onBackdropPress={currentUserStories.length !== 0 ? handleStoryModal : handleStoryPicker}
            >
                {
                    currentUserStories.length !== 0 ?
                        <SafeAreaView style={styles.storyModalContainer}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <ShowStory stories={currentUserStories} handleStoryModal={handleStoryModal}/>
                            </View>
                        </SafeAreaView>
                        :
                        <SafeAreaView style={styles.storyAddContainer}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity style={{alignSelf: 'center'}}
                                                      onPress={() => selectStoryPic('select')}>
                                        <Ionicons name='images-outline' size={50} color='white'/>
                                        <Text style={styles.modalText}>Select Photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{alignSelf: 'center'}}
                                                      onPress={() => selectStoryPic('take')}>
                                        <Ionicons name='camera-outline' size={50} color='white'/>
                                        <Text style={styles.modalText}>Take Photo</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                }
            </Modal>
            <Modal style={{margin: 0}}
                   isVisible={otherUserStoryModal}
                   animationIn={"slideInUp"}
                   onSwipeComplete={handleOtherUserStoryModal}
                   swipeDirection={'down'}
                   swipeThreshold={100}
                   backdropColor='transparent'
                   hasBackdrop={true}
                   onBackdropPress={handleOtherUserStoryModal}
            >
                <SafeAreaView style={styles.storyModalContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <ShowStory stories={otherSingleUserStories} handleStoryModal={handleOtherUserStoryModal}/>
                    </View>
                </SafeAreaView>
            </Modal>
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
        backgroundColor: 'black'
    },
    storyAddContainer: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'black',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 200
    },
    modalText: {
        color: 'white',
        right: 11,
        top: 5
    },
})