import React, {useEffect, useState} from "react";
import {
    Image,
    Modal,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Text,
    TouchableWithoutFeedback,
    Share,
    Animated
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Video} from "expo-av";
import ShareMedia from "./share_media";
import moment from "moment/moment";
const screen = Dimensions.get('window');

const ShowPostModal = ({ imageModal, setImageModal, type, content, navigation, post, likeStatus, likesCount, page, likePost, dislikePost }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [buttonModal, setButtonModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true)
    const fadeAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        if (!isPlaying) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000, // 1 second
                useNativeDriver: true,
            }).start(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
            });
        }
    }, [!isPlaying]);
    return(
        <Modal visible={imageModal} animationType="slide" transparent={true}>
            <TouchableWithoutFeedback onPress={() => {setIsPlaying(!isPlaying); setButtonModal(!buttonModal)}}>
                <View style={styles.imageModalContainer}>
                    <TouchableOpacity onPress={() => setImageModal(!imageModal)} style={{ zIndex: 100 }}>
                        <Ionicons name="close-outline" size={40} color="white"/>
                    </TouchableOpacity>
                    <View>
                        {imageLoading && <ActivityIndicator style={styles.loader}/>}
                        {
                            type === 'video' || type === 'video/mp4' ?
                                <Animated.View style={{ opacity: fadeAnim, top: '40%', zIndex: 1 }}>
                                    {
                                        !isPlaying ? <Ionicons name='play' size={60} color='brown' style={{ position: 'absolute', alignSelf: 'center', zIndex: 1}}  /> : <Ionicons name='pause' size={60} color='brown' style={{ position: 'absolute', alignSelf: 'center', zIndex: 1}}/>
                                    }
                                </Animated.View> : ''
                        }
                        {
                            type === 'video' || type === 'video/mp4' ?
                                <Video
                                    source={{uri: `${content}`}}
                                    style={{ width: screen.width, height: screen.height, bottom: 50 }}
                                    onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)}
                                    resizeMode='contain'
                                    isLooping={true}
                                    shouldPlay={isPlaying}
                                /> :
                                <Image source={{uri: `${content}`}}
                                       style={{ width: screen.width, height: screen.height, bottom: 40 }}
                                       resizeMode="contain"
                                       onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)}
                                />

                        }
                    </View>
                    <View style={styles.mainButtonModal}>
                        <TouchableOpacity style={type === 'video' || type === 'video/mp4' ? styles.videoUserDetails : styles.userDetails}>
                            <View>
                                <Image
                                    source={post?.user?.profile_image ? {uri: post?.user?.profile_image} : require('../../../assets/dummy_profile.png')}
                                    resizeMode='contain'
                                    style={styles.dummy}></Image>
                            </View>
                            <View style={styles.innerText}>
                                <Text style={styles.innerTextName}>{post?.user?.username}</Text>
                                <Text
                                    style={styles.innerTextMinutes}>{moment(post?.created_at).startOf("seconds").fromNow()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        page === 'home' ?
                            <View style={styles.mainButton}>
                                <View
                                    style={type === 'video' || type === 'video/mp4' ? styles.videoPostIcons : styles.postIcons}>
                                    <TouchableOpacity
                                        style={type === 'video' || type === 'video/mp4' ? styles.videoInnerModal : styles.innerModal}
                                        onPress={() => {likeStatus ? dislikePost(post?.id) : likePost(post?.id)}}
                                    >
                                        <Ionicons name={likeStatus ? 'heart' : 'heart-outline'} size={35}
                                                  color={likeStatus ? 'brown' : 'white'}></Ionicons>
                                        {type === 'video' || type === 'video/mp4' ?
                                            <Text style={styles.innerModalText}>{likesCount}</Text> :
                                            <Text style={styles.innerModalText}>Like</Text>}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={type === 'video' || type === 'video/mp4' ? styles.videoInnerModal : styles.innerModal}
                                        onPress={() => {
                                            setImageModal(!imageModal);
                                            navigation.navigate('CommentScreen', {post: post})
                                        }}>
                                        <Ionicons name='chatbubbles-outline' size={35} color='white'/>
                                        {type === 'video' || type === 'video/mp4' ?
                                            <Text style={styles.innerModalText}>10</Text> :
                                            <Text style={styles.innerModalText}>Comments</Text>}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={type === 'video' || type === 'video/mp4' ? styles.videoInnerModal : styles.innerModal}
                                        onPress={() => ShareMedia(content)}>
                                        <Ionicons name='share-social-outline' size={35} color='white'/>
                                        {type === 'video' || type === 'video/mp4' ?
                                            <Text style={styles.innerModalText}>20</Text> :
                                            <Text style={styles.innerModalText}>Share</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View> : ''
                    }
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    imageModalContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    buttonsModal: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    loader: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainButtonModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    mainButton: {
        zIndex: 1,
        position: 'absolute',
        width: '100%',
    },
    userDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 120,
        zIndex: 1,
    },
    videoUserDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 70,
        zIndex: 1,
    },
    innerModal: {
      flexDirection: 'row'
    },
    innerModalText: {
        fontSize: 17,
        color: 'white',
        alignSelf: 'center',
        left: 5
    },
    postIcons: {
        borderTopWidth: 1,
        borderTopColor: 'white',
        flexDirection: 'row',
        top: screen.height - 60,
        justifyContent: 'space-around',
    },
    videoPostIcons: {
        position: 'absolute',
        flexDirection: 'column',
        right: 20,
        top: screen.height - 250,
        alignSelf: 'flex-end',
        zIndex: 1,
    },
    videoInnerModal: {
        flexDirection: 'column',
        paddingBottom: 20,
    },
    dummy: {
        marginLeft: 15,
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    innerText: {
        marginLeft: 15,
        marginTop: 3
    },
    innerTextName: {
        color: 'white'
    },
    innerTextMinutes: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
    },
    icons: {

    }
})

export default ShowPostModal