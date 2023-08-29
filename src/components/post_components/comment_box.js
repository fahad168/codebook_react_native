import React, {useState,useRef} from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Backend_Url } from '@env'
import axios from "axios";
import {useSelector} from "react-redux";
import {Video, ResizeMode} from "expo-av";
import ShowPostModal from "../other_components/show_post_modal";

const CommentBox = ({ comment, post, handleInput, handleReply, handleReplyUser, setChildComments, childComments }) => {
    const [seeAll, setSeeAll] = useState(false)
    const [imageModal, setImageModal] = useState(false)
    const [content, setContent] = useState('')
    const [type, setType] = useState('')
    const { token } = useSelector((state) => state.loginReducer);
    const headers = {
        Accept: "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };

    const handleImageModal = (url, type) => {
        setContent(url)
        setType(type)
        setImageModal(!imageModal)
    }

    const Box = ({ single_comment }) => {
        return(
            <View>
                <View style={single_comment.parent_comment_id ? styles.commentReplyView : styles.commentView}>
                    <TouchableOpacity>
                        <Image
                            source={single_comment?.user?.profile_image ? {uri: single_comment?.user?.profile_image} : require('../../../assets/dummy_profile.png')}
                            resizeMode='contain'
                            style={styles.dummy}></Image>
                    </TouchableOpacity>
                    {
                        single_comment?.comment_image ?
                            <View style={styles.commentBox}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <TouchableOpacity>
                                        <Text style={styles.userName}>{single_comment?.user?.username}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.time}>23h</Text>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={styles.comment}>
                                        {single_comment?.body}
                                    </Text>
                                    <View style={styles.videoCommentInside}>
                                        {
                                            single_comment?.content_type === 'video/mp4' ?
                                                <TouchableOpacity
                                                    onPress={() => handleImageModal(single_comment?.comment_image, single_comment?.content_type)}>
                                                    <Video
                                                        source={{uri: `${single_comment?.comment_image}`}}
                                                        style={{width: 120, height: 120}}
                                                        resizeMode={ResizeMode.CONTAIN}
                                                        isLooping={false}
                                                    />
                                                </TouchableOpacity> :
                                                <TouchableOpacity
                                                    onPress={() => handleImageModal(single_comment?.comment_image, single_comment?.content_type)}>
                                                    <Image source={{uri: `${single_comment?.comment_image}`}}
                                                           resizeMode="contain" style={{width: 120, height: 120}}/>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </ScrollView>
                            </View> :
                            <View style={styles.commentBox}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <TouchableOpacity>
                                        <Text style={styles.userName}>{single_comment?.user?.username}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.time}>23h</Text>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={styles.comment}>
                                        {single_comment?.body}
                                    </Text>
                                </ScrollView>
                            </View>
                    }
                    <ShowPostModal
                        imageModal={imageModal}
                        setImageModal={setImageModal}
                        type={type}
                        content={content}
                        post={single_comment}
                        likeStatus={null}
                        likesCount={null}
                        page={'comment'}
                    />
                </View>
                <View style={single_comment?.parent_comment_id ? styles.child_icons : styles.icons}>
                    <TouchableOpacity>
                        <Ionicons name='heart-outline' size={20}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ left: 5 }} onPress={() => {
                        handleInput();
                        handleReplyUser();
                        handleReply()
                    }}>
                        <Ionicons name='arrow-undo-outline' size={20}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ left: 10 }} onPress={() => {
                        getChildComments(comment?.id);
                        setSeeAll(!seeAll)
                    }}>
                        <Ionicons name='return-down-forward-outline' size={20}>{single_comment.parent_comment_id ? '' :
                            <Text style={{
                                color: 'black',
                                fontSize: 10,
                                fontWeight: 'bold'
                            }}>{comment?.child_comments_count}</Text>}</Ionicons>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const getChildComments = (parent_comment_id) => {
        axios.get(`${Backend_Url}/comments/child_comments?post_id=${post.id}&parent_comment_id=${parent_comment_id}`, { headers })
            .then((res) => {
                setChildComments(res?.data?.child_comments)
            })
            .catch((error) => {});
    }

    return (
        <View>
            <Box single_comment={comment} />
            {
                seeAll ?
                    childComments.map ((single_comment) => (
                        comment.id === single_comment.parent_comment_id ?
                        <Box single_comment={single_comment} /> : ''
                    ))
                    : ""
            }
        </View>
    )
}

const styles = StyleSheet.create({
    dummy: {
        marginLeft: 10,
        marginTop: 10,
        width: 40,
        height: 40,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'black'
    },
    commentView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    commentReplyView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
        marginLeft: 50,
    },
    commentBox: {
        flexDirection: 'column',
        justifyContent: "flex-start",
        left: 10,
        width: 200,
        backgroundColor: 'brown',
        borderRadius: 20,
        paddingBottom: 10
    },
    videoCommentInside: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    userName: {
        color: 'yellow',
        margin: 5,
        marginLeft: 15,
        fontSize: 13
    },
    comment: {
        color: 'white',
        marginLeft: 15,
    },
    seeMoreText: {
        color: 'yellow',
        marginLeft: 15,
        marginBottom: 20,
        fontSize: 10,
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 5,
        marginLeft: 70
    },
    child_icons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5,
        marginRight: 70
    },
    time: {
        marginRight: 20,
        marginTop: 5,
    },
})

export default CommentBox