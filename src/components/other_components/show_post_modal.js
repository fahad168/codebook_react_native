import React, {useState} from "react";
import {
    Image,
    Modal,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Text,
    TouchableWithoutFeedback, Share
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Video} from "expo-av";
import ShareMedia from "./share_media";
import moment from "moment/moment";
const screen = Dimensions.get('window');

const ShowPostModal = ({ imageModal, setImageModal, type, content, navigation, post }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [buttonModal, setButtonModal] = useState(false);
    return(
        <Modal visible={imageModal} animationType="slide" transparent={true}>
            <TouchableWithoutFeedback onPress={() => setButtonModal(!buttonModal)}>
                <View style={styles.imageModalContainer}>
                    <View style={{zIndex: 1}}>
                        <TouchableOpacity onPress={() => setImageModal(!imageModal)}>
                            <Ionicons name="close-outline" size={40} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {imageLoading && <ActivityIndicator style={styles.loader}/>}
                        {
                            type === 'video' || type === 'video/mp4' ?
                                <Video
                                    source={{uri: `${content}`}}
                                    style={{ width: screen.width, height: screen.height, bottom: 50 }}
                                    onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)}
                                    resizeMode='contain'
                                    isLooping={true}
                                    useNativeControls
                                    shouldPlay
                                /> :
                                <Image source={{uri: `${content}`}}
                                       style={{ width: screen.width, height: screen.height, bottom: 40}}
                                       resizeMode="contain"
                                       onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)}
                                />

                        }
                        <Modal visible={buttonModal} animationType='fade' transparent={true}>
                            <TouchableWithoutFeedback onPress={() => setButtonModal(!buttonModal)}>
                                <View style={styles.mainButtonModal}>
                                    <TouchableOpacity style={styles.userDetails}>
                                        <View>
                                            <Image
                                                source={post?.user?.profile_image ? {uri: post?.user?.profile_image} : require('../../../assets/dummy_profile.png')}
                                                resizeMode='contain'
                                                style={styles.dummy}></Image>
                                        </View>
                                        <View style={styles.innerText}>
                                            <Text style={styles.innerTextName}>{post?.user?.username}</Text>
                                            <Text style={styles.innerTextMinutes}>{moment(post?.created_at).startOf("seconds").fromNow()}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.buttonsModal}>
                                        <View style={type === 'video' || type === 'video/mp4' ? styles.videoPostIcons : styles.postIcons}>
                                            <TouchableOpacity style={type === 'video' || type === 'video/mp4' ? styles.videoInnerModal : styles.innerModal}>
                                                <Ionicons name='heart-outline' size={35} color='white'
                                                          style={styles.icons}></Ionicons>
                                                {type === 'video' || type === 'video/mp4' ? <Text style={styles.innerModalText}>1</Text> : <Text style={styles.innerModalText}>Like</Text>}
                                            </TouchableOpacity>
                                            <TouchableOpacity style={type === 'video' || type === 'video/mp4' ? styles.videoInnerModal : styles.innerModal} onPress={() => {setImageModal(!imageModal); navigation.navigate('CommentScreen', {post: post})}}>
                                                <Ionicons name='chatbubbles-outline' size={35} color='white'
                                                          style={styles.icons}/>
                                                {type === 'video' || type === 'video/mp4' ? <Text style={styles.innerModalText}>10</Text> : <Text style={styles.innerModalText}>Comments</Text>}
                                            </TouchableOpacity>
                                            <TouchableOpacity style={type === 'video' || type === 'video/mp4' ? styles.videoInnerModal : styles.innerModal}  onPress={() => ShareMedia(content)}>
                                                <Ionicons name='share-social-outline' size={35} color='white'
                                                          style={styles.icons}/>
                                                {type === 'video' || type === 'video/mp4' ? <Text style={styles.innerModalText}>20</Text> : <Text style={styles.innerModalText}>Share</Text>}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    imageModalContainer: {
        flex: 1,
        backgroundColor: 'black'
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
    userDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 100,
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
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    videoPostIcons: {
        flexDirection: 'column',
        bottom: 30,
        right: 20,
        alignSelf: 'flex-end'
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
    }
})

export default ShowPostModal