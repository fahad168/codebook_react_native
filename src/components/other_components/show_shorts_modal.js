import React, {useEffect, useRef, useState} from "react";
import {
    Image,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Text,
    TouchableWithoutFeedback,
    Share,
    Animated, FlatList, KeyboardAvoidingView, TextInput
} from "react-native";
import {Video} from "expo-av";
import moment from "moment/moment";
import Modal from "react-native-modal";
import ShareMedia from "./share_media";
const screen = Dimensions.get('window');
import Ionicons from "react-native-vector-icons/Ionicons";
import {useIsFocused} from "@react-navigation/native";
import ShortsCommentModal from "./shorts_comment_modal";

const ShowShortsModal = ({ imageModal, setImageModal, content, navigation, short, likeStatus, likesCount, likePost, dislikePost, allShorts }) => {
    const test = useIsFocused()
    const [imageLoading, setImageLoading] = useState(false)
    const [buttonModal, setButtonModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true)
    const fadeAnim = useState(new Animated.Value(1))[0];
    const [visibleVideoIndex, setVisibleVideoIndex] = useState(null);
    const [viewShort, setViewShort] = useState([])
    const [commentModal, setCommentModal] = useState(false)

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

    const onViewableItemsChanged = ({viewableItems,}) => {
        setVisibleVideoIndex(viewableItems[0].index)
    }

    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged },
    ]);

    const handleCommentModal = () => {
        setCommentModal(!commentModal)
    }

    return(
        <Modal
            style={{margin: 0, padding: 0}}
            isVisible={imageModal}
            animationIn={"slideInUp"}
        >
            <FlatList
                data={allShorts}
                viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                }
                snapToAlignment={'start'}
                snapToInterval={screen.height}
                decelerationRate={'fast'}
                renderItem={({item, index}) => {
                    return (
                        <TouchableWithoutFeedback onPress={() => {
                            setIsPlaying(!isPlaying);
                            setButtonModal(!buttonModal)
                        }}>
                            <View style={styles.imageModalContainer}>
                                <TouchableOpacity onPress={() => setImageModal(!imageModal)} style={{zIndex: 100}}>
                                    <Ionicons name="close-outline" size={40} color="white"/>
                                </TouchableOpacity>
                                <View>
                                    <Animated.View style={{opacity: fadeAnim, top: '40%', zIndex: 1}}>
                                        {
                                            !isPlaying ? <Ionicons name='play' size={60} color='brown' style={{
                                                position: 'absolute',
                                                alignSelf: 'center',
                                                zIndex: 1
                                            }}/> : <Ionicons name='pause' size={60} color='brown'
                                                             style={{position: 'absolute', alignSelf: 'center', zIndex: 1}}/>
                                        }
                                    </Animated.View>
                                    {imageLoading && <ActivityIndicator color='white' size={50} style={styles.loader}/>}
                                    <Video
                                        source={{uri: `${item?.post_image}`}}
                                        style={{width: screen.width, height: screen.height, bottom: 50}}
                                        onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)}
                                        resizeMode='contain'
                                        isLooping={true}
                                        shouldPlay={isPlaying && index === visibleVideoIndex}
                                    />
                                </View>
                                <View style={styles.mainButtonModal}>
                                    <TouchableOpacity style={styles.videoUserDetails}>
                                        <View style={styles.innerText}>
                                            <Text style={styles.innerTextName}>{item?.user?.username}</Text>
                                            <Text
                                                style={styles.innerTextMinutes}>{moment(item?.created_at).startOf("seconds").fromNow()}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.mainButton}>
                                    <View
                                        style={styles.videoPostIcons}>
                                        <TouchableOpacity
                                            style={styles.userImage}
                                        >
                                            <Image
                                                source={item?.user?.profile_image ? {uri: item?.user?.profile_image} : require('../../../assets/dummy_profile.png')}
                                                resizeMode='contain' style={styles.dummy}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.videoInnerModal}
                                            onPress={() => {
                                                likeStatus ? dislikePost(item?.id) : likePost(item?.id)
                                            }}
                                        >
                                            <View>
                                                <Ionicons name={likeStatus ? 'heart' : 'heart-outline'} size={35}
                                                          color={likeStatus ? 'brown' : 'white'}/>
                                                <Text style={styles.innerModalText}>{likesCount}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.videoInnerModal}
                                            onPress={() => {
                                                handleCommentModal()
                                            }}>
                                            <View>
                                                <Ionicons name='chatbubbles-outline' size={35} color='white'/>
                                                <Text style={styles.innerModalText}>10</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.videoInnerModal}
                                            onPress={() => ShareMedia(content)}>
                                            <View>
                                                <Ionicons name='share-social-outline' size={35} color='white'/>
                                                <Text style={styles.innerModalText}>20</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }}
            />
            <ShortsCommentModal
                commentModal={commentModal}
                handleCommentModal={handleCommentModal}
            />
        </Modal>
    )
}

const styles = StyleSheet.create({
    imageModalContainer: {
        flex: 1,
        backgroundColor: 'black',
        height: screen.height
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
    videoUserDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 100,
        left: 10,
        zIndex: 1,
    },
    videoPostIcons: {
        position: 'absolute',
        flexDirection: 'column',
        right: 20,
        top: screen.height - 320,
        alignSelf: 'flex-end',
        zIndex: 1,
    },
    videoInnerModal: {
        flexDirection: 'column',
        paddingBottom: 20,
        left: 7
    },
    userImage: {
        flexDirection: 'column',
        paddingBottom: 25,
    },
    dummy: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 1
    },
    innerText: {
        marginLeft: 15,
        marginTop: 3
    },
    innerTextName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    innerTextMinutes: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
    },
    icons: {

    },
})

export default ShowShortsModal