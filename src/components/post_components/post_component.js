import React, {useEffect, useState, useRef} from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator, Alert, Share, TouchableWithoutFeedback, ScrollView
} from 'react-native'
import Modal from "react-native-modal";
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video } from 'expo-av';
import moment from "moment";
import {useSelector} from "react-redux";
import { Backend_Url } from '@env'
import axios from "axios";
import {Logout} from "../../../redux/actions/action";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import { useNavigation } from "@react-navigation/native";
import ShowPostModal from "../other_components/show_post_modal";
import ShareMedia from "../other_components/share_media";

const PostComponent = ({post}) => {
    const navigation = useNavigation()
    const [toggleModal, setToggleModal] = useState(false)
    const [imageLoading, setImageLoading] = useState(true);
    const { token } = useSelector((state) => state.loginReducer);
    const [likes, setLikesCount] = useState(post?.like?.likes_count)
    const [likeStatus, setLikeStatus] = useState(post?.like?.is_liked)
    const [likeId, setLikeId] = useState(post?.like?.id)
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [imageModal, setImageModal] = useState(false)
    const [content, setContent] = useState('')
    const [type, setType] = useState('')
    const headers = {
        Accept: "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };

    const handleModal = () => {
        setToggleModal(!toggleModal)
    }

    const handleImageModal = (url, type) => {
        setContent(url)
        setType(type)
        setImageModal(!imageModal)
    }

    const dislikePost = (post_id) => {
        axios.post(`${Backend_Url}/likes/dislike_post`, {like_id: likeId, post_id: post_id}, { headers })
            .then((res) => {
                setLikesCount(likes - 1)
                setLikeStatus(false)
                setLikeId(res?.data?.like?.id)
            })
            .catch((error) => {
            });
    }
    const likePost = (post_id) => {
        axios.post(`${Backend_Url}/likes/like_post`, {post_id: post_id}, { headers })
            .then((res) => {
                setLikesCount(likes + 1)
                setLikeStatus(true)
                setLikeId(res?.data?.like?.id)
            })
            .catch((error) => {
            });
    }


    return(
        <View style={styles.mainContainer}>
            <View style={styles.innerView}>
                <TouchableOpacity style={styles.innerView1}>
                    <View>
                        <Image source={post?.user?.profile_image ? {uri: post?.user?.profile_image} : require('../../../assets/dummy_profile.png')} resizeMode='contain'
                               style={post?.user?.profile_image ? styles.userImage : styles.dummy}></Image>
                    </View>
                    <View style={styles.innerText}>
                        <Text style={styles.innerTextName}>{post?.user?.username}</Text>
                        <Text style={styles.innerTextMinutes}>{moment(post?.created_at).startOf("seconds").fromNow()}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleModal}>
                    <Ionicons name="ellipsis-horizontal-outline" size={25} color='brown' style={styles.dotIcon}/>
                    <Modal
                        style={{margin: 0}}
                        isVisible={toggleModal}
                        animationIn={"slideInUp"}
                        onSwipeComplete={handleModal}
                        swipeDirection={'down'}
                        swipeThreshold={100}
                        backdropColor='transparent'
                        hasBackdrop={true}
                    >
                        <View style={styles.dropdownContainer}>
                                <TouchableOpacity style={{ alignSelf: 'center', top: 33, zIndex: 1 }}>
                                    <Ionicons name="remove-outline" size={45} color='white'/>
                                </TouchableOpacity>
                                <View style={styles.dropdownContent}>
                                    <View style={[{marginTop: 40}, styles.innerDivStyle1]}>
                                        <View style={styles.textView}>
                                            <TouchableOpacity style={styles.touchableOpacity}>
                                                <Ionicons name='trash-outline' color='white' size={35}/><
                                                Text style={styles.text}>Delete Post</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.innerDivStyle}>
                                        <View style={styles.textView}>
                                            <TouchableOpacity style={styles.touchableOpacity}>
                                                <Ionicons name='eye-off-outline' color='white' size={35}/>
                                                <Text style={styles.text}>Hide This Post</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.touchableOpacity}>
                                                <Ionicons name='eye-off-outline' color='white' size={35}/>
                                                <Text style={styles.text}>Hide All {post?.user?.username} Posts </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.touchableOpacity}>
                                                <Ionicons name='flag-outline' color='white' size={35}/><
                                                Text style={styles.text}>Flag Post</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.innerDivStyle}>
                                        <View style={styles.textView}>
                                            <TouchableOpacity style={styles.touchableOpacity}>
                                                <Ionicons name='trash-outline' color='white' size={35}/><
                                                Text style={styles.text}>Report Post</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.touchableOpacity}>
                                                <Ionicons name='eye-off-outline' color='white' size={35}/>
                                                <Text style={styles.text}>Report User ( {post?.user?.username} )</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.touchableOpacity}>
                                                <Ionicons name='eye-off-outline' color='white' size={35}/>
                                                <Text style={styles.text}>Report And Block User
                                                    ( {post?.user?.username} )</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={[{marginTop: 10}, styles.innerDivStyle1]}>
                                        <View style={styles.textView}>
                                            <TouchableOpacity style={styles.touchableOpacity}>
                                                <Ionicons name='trash-outline' color='white' size={35}/><
                                                Text style={styles.text}>Block User ( {post?.user?.username} )</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                        </View>
                    </Modal>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.description}>{post?.description}</Text>
            </View>
            <TouchableWithoutFeedback
                onPress={() => handleImageModal(post?.post_image, post?.content_type.split('/')[0])}>
                <View style={{ top: -50 }}>
                    {imageLoading && <ActivityIndicator style={styles.loader}/>}
                    {
                        post?.content_type.split('/')[0] === 'image' ?
                            <Image source={{uri: post?.post_image}} resizeMode='contain'
                                   style={{height: screenHeight / 2, width: screenWidth}}
                                   onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)}
                            /> :
                            <Video
                                source={{uri: post?.post_image}}
                                style={{height: screenHeight / 2, width: screenWidth}}
                                onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)}
                                resizeMode="contain"
                                shouldPlay={false}
                                isLooping={false}
                                useNativeControls={false}
                            />
                    }
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.postIcons}>
                <TouchableOpacity onPress={() => {likeStatus ? dislikePost(post?.id) : likePost(post?.id)}}>
                    <Ionicons name={likeStatus ? 'heart' : 'heart-outline'} size={35} color={likeStatus ? 'brown' : 'black'} style={styles.icons}><Text style={{ color: 'black', fontSize: 20 }}>{likes}</Text></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', {post: post})}>
                    <Ionicons name='chatbubbles-outline' size={35} color='black' style={styles.icons}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => ShareMedia(post?.post_image)}>
                    <Ionicons name='share-social-outline' size={35} color='black' style={styles.icons}/>
                </TouchableOpacity>
            </View>
            <ShowPostModal
                imageModal={imageModal}
                setImageModal={setImageModal}
                type={type}
                content={content}
                navigation={navigation}
                post={post}
            />
        </View>
    )
}

export default PostComponent

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 0,
        marginBottom: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    imageStyle: {
        flexDirection: "column",
        justifyContent: 'space-between',
    },
    innerView: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    innerView1: {
        flexDirection: 'row'
    },
    userImage: {
        marginLeft: 10,
        marginTop: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    dummy: {
        marginLeft: 10,
        marginTop: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'black'
    },
    innerText: {
        marginTop: 12,
        marginLeft: 15,
    },
    innerTextName: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'brown'
    },
    innerTextMinutes: {
        marginTop: 2,
        color: 'black'
    },
    dotIcon: {
        marginTop: 20,
        marginRight: 15,
    },
    postIcons: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute',
        alignSelf: "center",
        bottom: 60
    },
    icons: {
        paddingRight: 50,
    },
    dropdownContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    dropdownContent: {
        backgroundColor: '#484848',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 570,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    innerDivStyle: {
        backgroundColor: '#383838',
        alignItems: "flex-start",
        width: "90%",
        height: 175,
        borderRadius: 15,
        marginTop: 10,
    },
    innerDivStyle1: {
        backgroundColor: '#383838',
        alignItems: "flex-start",
        width: "90%",
        height: 65,
        borderRadius: 15,
    },
    textView: {
        left: 30,
    },
    touchableOpacity: {
        flexDirection: 'row',
        paddingTop: 10,
    },
    text: {
        color: 'white',
        alignSelf: 'center',
        left: 20,
        fontSize: 15,
        fontWeight: 'bold'
    },
    description: {
        marginTop: 15,
        marginRight: 15,
        marginLeft: 15,
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
})