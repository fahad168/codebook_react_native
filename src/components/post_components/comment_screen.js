import React, {useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Backend_Url } from '@env'
import {useSelector} from "react-redux";
import axios from "axios";
import {useIsFocused} from "@react-navigation/native";
import CommentBox from "./comment_box";
import bottom_bar_styles from "../../bottom_bar/bottom_bar_styles";
import * as ImagePicker from "expo-image-picker";
import {Video} from "expo-av";
const screen = Dimensions.get('window');


const CommentScreen = (props) => {
    const inputRef = useRef(null);
    const post = props.route.params.post
    const focused = useIsFocused()
    const { token } = useSelector((state) => state.loginReducer);
    const [commentBody, setCommentBody] = useState('')
    const [comments, setComments] = useState([])
    const [isReply, setIsReply] = useState(false)
    const [userName, setUserName] = useState('')
    const [commentForReply, setCommentForReply] = useState('')
    const [childComments, setChildComments] = useState([])
    const [imageModal, setImageModal] = useState(false)
    const [image, setImage] = useState([]);
    const [imageVisible, setImageVisible] = useState(false)
    const [isSending, setIsSending] = useState(false)


    const headers = {
        Accept: "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        if (focused) {
            getComments()
        }
    }, [focused])

    const handleInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleModal = () => {
        setImageModal(!imageModal)
    }

    const selectCommentPic = async (key) => {
        let result
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
            setImage(result.assets);
            setImageVisible(!imageVisible)
            handleModal()
        }else{
            console.log('canceled')
        }
    }

    const createComment = () => {
        setIsSending(!isSending)
        const headers = {
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        };
        const formData = new FormData();
        let type;
        if (image[0]) {
            if(image[0].type === 'image'){
                type = 'image/jpg'
            }else {
                type = 'video/mp4'
            }
            formData.append('comment_image', {
                uri: image[0].uri,
                type: type,
                name: type,
            });
        }
        formData.append("post_id", post.id)
        formData.append("body", commentBody)
        axios.post(`${Backend_Url}/comments/create_comment`, formData, { headers })
            .then((res) => {
                const newComments = [res?.data?.comment, ...comments]
                setCommentBody('')
                setImage([])
                setImageVisible(!imageVisible)
                setComments(newComments)
                setIsSending(false)
            })
            .catch((error) => {});
    }

    const getComments = () => {
        axios.get(`${Backend_Url}/comments?post_id=${post.id}`, { headers })
            .then((res) => {
                setComments(res?.data?.comments)
            })
            .catch((error) => {});
    }

    const createChildComment = (comment) => {
        setIsSending(!isSending)
        const headers = {
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        };
        let type;
        const formData = new FormData();
        if (image[0]) {
            if(image[0].type === 'image'){
                type = 'image/jpg'
            }else {
                type = 'video/mp4'
            }
            formData.append('comment_image', {
                uri: image[0].uri,
                type: type,
                name: type,
            });
        }
        formData.append('parent_comment_id', comment?.id)
        formData.append('post_id', post?.id)
        formData.append('body', commentBody)
        axios.post(`${Backend_Url}/comments/create_child_comment`, formData , { headers })
            .then((res) => {
                const newChildComments = [res?.data?.child_comment, ...childComments]
                setCommentBody('')
                setImage([])
                setImageVisible(!imageVisible)
                setChildComments(newChildComments)
                setIsSending(false)

            })
            .catch((error) => {});
    }

    const handleReply = () => {
        setIsReply(true)
    }

    const handleReplyUser = (comment) => {
        setUserName(comment?.user.username)
        setCommentForReply(comment)
    }

    const cancelImage = (Id) => {
        setImage(image.filter(element => element.assetId !== Id))
        if(image.length === 1){
            setImage([])
            setImageVisible(!imageVisible)
        }
    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{position: 'absolute'}} onPress={() => props.navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={30} color="brown" style={styles.icon}/>
                </TouchableOpacity>
                <Text style={styles.headerText}>Comment</Text>
            </View>
            <ScrollView>
                {
                    comments?.map (( comment ) => (
                        <CommentBox
                            comment={comment}
                            post={post}
                            // headers={headers}
                            handleInput={handleInput}
                            handleReply={handleReply}
                            handleReplyUser={() => handleReplyUser(comment)}
                            setChildComments={setChildComments}
                            childComments={childComments}
                        />

                    ))
                }
            </ScrollView>
            {
                isReply ?
                    <View style={styles.replyText}>
                        <Text style={{color: 'black', fontWeight: 'bold', left: 20, top: 5, fontSize: 15}}>You are
                            replying
                            to <Text style={{color: 'brown'}}>{userName}</Text></Text>
                        <TouchableOpacity style={{ flex: 1, right: 40, top: 5 }} onPress={() => setIsReply(false)}>
                            <Text style={{ color: 'red', alignSelf: 'flex-end', fontSize: 15, fontWeight: 'bold' }}>cancel</Text>
                        </TouchableOpacity>
                    </View> :
                    ""
            }
            {
                imageVisible ? <View>
                    <ScrollView horizontal={true}>
                        {
                            image.map((single_image) => (
                                single_image.type === 'video' ?
                                    <View>
                                        <TouchableOpacity style={{zIndex: 1}} onPress={() => cancelImage(single_image.assetId)}>
                                            <Ionicons name='close-outline' size={18} color='black'
                                                      style={styles.videoCloseIcon}/>
                                        </TouchableOpacity>
                                        <Video
                                            source={{uri: `${single_image.uri}`}}
                                            style={styles.selectedVideoShow}
                                            resizeMode="contain"
                                            shouldPlay
                                        /></View> :
                                    <View>
                                        <TouchableOpacity style={{zIndex: 1}} onPress={() => cancelImage(single_image.assetId)}>
                                            <Ionicons name='close-outline' size={18} color='black'
                                                      style={styles.closeIcon}/>
                                        </TouchableOpacity>
                                        <Image source={{uri: `${single_image.uri}`}} style={styles.selectedImageShow}/>
                                    </View>
                            ))
                        }
                    </ScrollView>
                </View> : ''
            }
            <View style={styles.commentInput}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity onPress={handleModal}>
                        <Ionicons name='image-outline' size={30} color='black'/>
                    </TouchableOpacity>
                    <TextInput
                        ref={inputRef}
                        placeholder='Type Message....'
                        style={styles.textInput}
                        onChangeText={text => setCommentBody(text)}
                        value={commentBody}

                    />
                </View>
                <View>
                    {
                        isReply ?
                            <TouchableOpacity onPress={() => createChildComment(commentForReply)} style={styles.sendIcon}>
                                {isSending ? <ActivityIndicator color='brown' size={20} animating={isSending} /> : <Ionicons name='send-outline' size={30} color='brown'/>}
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={createComment} style={styles.sendIcon}>
                                {isSending ? <ActivityIndicator color='brown' size={20} animating={isSending} /> : <Ionicons name='send-outline' size={30} color='brown'/>}
                            </TouchableOpacity>
                    }
                </View>
            </View>
            <Modal visible={imageModal} animationType='slide' transparent={true}>
                <TouchableWithoutFeedback onPress={handleModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => selectCommentPic('select')}>
                                <Ionicons name='images-outline' size={50} color='white'/>
                                <Text style={styles.modalText}>Select Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => selectCommentPic('take')}>
                                <Ionicons name='camera-outline' size={50} color='white'/>
                                <Text style={styles.modalText}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

export default CommentScreen

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'brown',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'brown'
    },
    icon: {
        marginRight: 10,
    },
    commentInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 20,
        marginTop: 20,
        padding: 10,
        borderWidth: 2,
        borderColor: 'brown',
        borderRadius: 30,
        alignItems: 'center',
    },
    sendIcon: {
        right: 30
    },
    textInput: {
        flex: 1,
        marginLeft: 15,
        marginRight: 40,
    },
    replyText: {
        flexDirection: "row",
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
    selectedImageShow: {
        width: 70,
        height: 70,
        marginLeft: 20,
        marginTop: 5,
        borderRadius: 10
    },
    selectedVideoShow: {
        width: 80,
        height: 70,
        marginLeft: 20,
        marginTop: 5,
        borderRadius: 10
    },
    closeIcon: {
        position: 'absolute',
        zIndex: 1,
        marginLeft: 70,
        marginTop: 6,
    },
    videoCloseIcon: {
        position: 'absolute',
        zIndex: 1,
        marginLeft: 80,
        marginTop: 15,
    }
});