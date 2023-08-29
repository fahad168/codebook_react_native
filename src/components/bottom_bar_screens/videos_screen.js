import React, {useEffect, useRef, useState} from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    FlatList,
    RefreshControl,
    Alert,
    ActivityIndicator,
    Dimensions, SafeAreaView, ImageBackground
} from 'react-native'
import {useSelector} from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import PostComponent from "../post_components/post_component";
import axios from "axios";
import {Logout} from "../../../redux/actions/action";
import { Backend_Url } from '@env'
import {useIsFocused, useNavigation} from "@react-navigation/native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import ShowShortsModal from "../other_components/show_shorts_modal";
const VideoScreen = () => {
    const videoFocused = useIsFocused()
    const navigation = useNavigation()
    const { user, token } = useSelector((state) => state.loginReducer);
    const [videos, setVideos] = useState([])
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(true);
    const [isLoading, setIsLoading] = useState(false)
    const [shortModal, setShortModal] = useState(false)
    const [currentUserShort, setCurrentUserShort] = useState(null)
    const [shorts, setShorts] = useState([])
    const [imageModal, setImageModal] = useState(false)
    const [content, setContent] = useState('')
    const [type, setType] = useState('')
    const [singleShort, setSingleShort] = useState('')
    const [visibleVideoIndex, setVisibleVideoIndex] = useState(null);

    const headers = {
        Accept: "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };

    useEffect(  () => {
        setPage(1)
        if (refreshing || videoFocused){
            getVideos()
            setRefreshing(false);
        }
    }, [refreshing, videoFocused])

    useEffect(() => {
        if ( videoFocused ) {
            getShorts()
        }
    }, [videoFocused])

    const onViewableItemsChanged = ({viewableItems,}) => {
        setVisibleVideoIndex(viewableItems[0].index)
    }

    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged },
    ]);

    const shortVideo = async (key) => {
        let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                quality: 1,
            });
        if (!result.canceled) {
            setCurrentUserShort(result)
            setShortModal(!shortModal)
        }else{
            console.log('canceled')
        }
    }

    const createShort = async () => {
        setIsLoading(!isLoading)
        const formData = new FormData();
        const headers = {
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        };
        formData.append('post_image', {
            uri: currentUserShort.assets[0].uri,
            type: 'video/mp4',
            name: 'short/mp4',
        });
        formData.append('video_type', 'short')
        formData.append('description', 'hello')
        axios
            .post(`${Backend_Url}/posts`, formData , {headers})
            .then((res) => {
                setShortModal(!shortModal)
                setIsLoading(false)
                getShorts()
            })
            .catch((error) => console.log(error));
    }

    const getShorts = () => {
        axios
            .get(`${Backend_Url}/posts/shorts` , {headers})
            .then((res) => {
                setShorts(res?.data?.shorts)
            })
            .catch((error) => console.log(error));
    }

    const handleScroll = () => {
        getVideos()
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
    }

    const handleShortModal = () => {
        setShortModal(!shortModal)
    }

    const handleImageModal = (short, url, type) => {
        setContent(url)
        setType(type)
        setSingleShort(short)
        setImageModal(!imageModal)
        const foundIndex = shorts.findIndex(item => item.id === short.id)
        if (foundIndex !== -1) {
            const foundShort = shorts[foundIndex];
            const newShorts = [...shorts];
            newShorts.splice(foundIndex, 1);
            newShorts.unshift(foundShort);
            setShorts(newShorts);
        }
    }

    const getVideos = () => {
        setIsLoading(true)

        axios.get(`${Backend_Url}/posts/videos?page=${page}`, { headers })
            .then((res) => {
                if (page === 1){
                    setVideos(res?.data?.videos)
                    setPage(page + 1)
                    // setPage(prevPage => prevPage + 1);
                }else{
                    const newData = res?.data?.videos
                    const combineData = videos.concat(newData.map(obj => ({ ...obj })));
                    setVideos(combineData)
                    setPage(page + 1)
                }
            })
            .catch((error) => {});
        setIsLoading(false)
    }

    return(
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 10 }}>
                <View style={styles.shortsMainView}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity onPress={shortVideo}>
                            <View style={styles.addShortsView}>
                                <Image source={{uri: user?.img ? user?.img : ''}} resizeMode='cover'
                                       style={styles.addUserShortView}/>
                                <Ionicons name='add-circle' color='white' size={40} style={styles.addUserShortIcon}/>
                            </View>
                        </TouchableOpacity>
                        {shorts?.map((short) => (
                            <TouchableOpacity onPress={() => handleImageModal(short ,short?.post_image, short?.content_type)}>
                                <Image source={{uri: short?.thumbnail}} resizeMode="cover"
                                                 style={styles.otherShortsView}>
                                </Image>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity>
                            <View style={styles.showMoreMainView}>
                                <View style={styles.showMore}>
                                    <Text style={styles.showMoreText}>See More</Text>
                                    <Ionicons name='arrow-forward' color='brown' size={30}
                                              style={styles.showMoreIcon}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>

                </View>
                <View style={styles.header}>
                    <View style={styles.headerInnerView}>
                        <Text style={styles.headerText}>Videos</Text>
                    </View>
                </View>
            </View>
            {isLoading && <ActivityIndicator size={40} color='brown' />}
            <View style={{ flex: 1, paddingBottom: 65 }}>
                <FlatList
                    data={videos}
                    viewabilityConfigCallbackPairs={
                        viewabilityConfigCallbackPairs.current
                    }
                    renderItem={({item, index}) => <PostComponent post={item} index={index} visibleVideoIndex={visibleVideoIndex}/>}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleScroll}
                    onEndReachedThreshold={1}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                />
            </View>
            <Modal
                style={{margin: 0}}
                isVisible={shortModal}
                animationIn={"slideInRight"}
                backdropColor='transparent'
                hasBackdrop={true}
            >
                <View style={styles.mainModalView}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10 }}>
                            <TouchableOpacity onPress={handleShortModal}>
                                <View style={styles.cancelButton}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            {
                                isLoading ?
                                    <View style={styles.createButton}><ActivityIndicator color='white' style={{top: 5}}/></View> :
                                    <TouchableOpacity onPress={() => createShort()}>
                                        <View style={styles.createButton}>
                                            <Text style={styles.buttonText}>Create</Text>
                                        </View>
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.videoView}>
                            <Video
                                source={{ uri: `${ currentUserShort?.assets[0]?.uri }` }}
                                style={{height: '100%', width: "100%"}}
                                resizeMode="contain"
                                shouldPlay={true}
                                isLooping={true}
                                useNativeControls={false}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <ShowShortsModal
                imageModal={imageModal}
                setImageModal={setImageModal}
                content={content}
                navigation={navigation}
                short={singleShort}
                likeStatus={null}
                likesCount={null}
                likePost={null}
                dislikePost={null}
                allShorts={shorts}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shortsMainView: {
        width: '100%',
        height: 150,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addShortsView: {
        width: 90,
        height: 140,
        margin: 5,
    },
    otherShortsView: {
        width: 90,
        height: 140,
        margin: 5,
        borderColor: 'brown',
        borderWidth: 2,
        borderRadius: 10,
    },
    addUserShortView: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    addUserShortIcon: {
        position: 'absolute',
        alignSelf: 'center',
        top: '35%'
    },
    showMoreMainView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        width: 120,
    },
    showMore:{
        flexDirection: 'row',
        justifyContent: 'center',
    },
    showMoreText:{
        alignSelf: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'brown'
    },
    showMoreIcon: {
        alignSelf: 'center',
    },
    header: {
        top: 10,
        borderWidth: 2,
        borderColor: 'brown',
        margin: 10,
        borderRadius: 5
    },
    headerInnerView: {
        padding: 5,
    },
    headerText: {
        alignSelf: "center",
        fontWeight: 'bold'
    },
    mainModalView: {
        flex: 1,
        backgroundColor: 'black'
    },
    videoView: {
        top: 20,
        height: 600,
        width: '100%',
    },
    createButton: {
        backgroundColor: 'brown',
        width: 100,
        height: 30,
        borderRadius: 5,
        left: 5
    },
    cancelButton: {
        width: 75,
        height: 30,
    },
    buttonText: {
        color: 'white',
        alignSelf: "center",
        fontSize: 18,
        top: 1
    }
})

export default VideoScreen