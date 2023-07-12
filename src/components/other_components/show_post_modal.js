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
    TouchableWithoutFeedback
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Video} from "expo-av";
const screen = Dimensions.get('window');

const ShowPostModal = ({ imageModal, setImageModal, type, content, navigation, post }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [buttonModal, setButtonModal] = useState(false);
    return(
        <Modal visible={imageModal} animationType="slide" transparent={true}>
            <TouchableWithoutFeedback onPress={() => setButtonModal(!buttonModal)}>
                <View style={styles.imageModalContainer}>
                    <View>
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
                                    style={{ width: screen.width, height: screen.height }}
                                    onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)}
                                    resizeMode='contain'
                                    isLooping={true}
                                    useNativeControls
                                    shouldPlay
                                /> :
                                <Image source={{uri: `${content}`}}
                                       style={{ width: screen.width, height: screen.height }}
                                       resizeMode="contain"
                                       onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)}
                                />

                        }
                        <Modal visible={buttonModal} animationType='fade' transparent={true}>
                            <TouchableWithoutFeedback onPress={() => setButtonModal(!buttonModal)}>
                                <View style={styles.mainButtonModal}>
                                    {/*<View style={styles.userDetails}>*/}
                                    {/*    <Text style={{color: 'white'}}>Hello</Text>*/}
                                    {/*</View>*/}
                                    <View style={styles.buttonsModal}>
                                        <View style={styles.postIcons}>
                                            <TouchableOpacity style={styles.innerModal}>
                                                <Ionicons name='heart-outline' size={35} color='white'
                                                          style={styles.icons}></Ionicons>
                                                <Text style={styles.innerModalText}>Like</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.innerModal} onPress={() => navigation.navigate('CommentScreen', {post: post})}>
                                                <Ionicons name='chatbubbles-outline' size={35} color='white'
                                                          style={styles.icons}/>
                                                <Text style={styles.innerModalText}>Comments</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.innerModal}>
                                                <Ionicons name='share-social-outline' size={35} color='white'
                                                          style={styles.icons}/>
                                                <Text style={styles.innerModalText}>Share</Text>
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
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 100
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
})

export default ShowPostModal