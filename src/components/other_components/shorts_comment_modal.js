import React from "react";
import Modal from "react-native-modal";
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    TextInput, KeyboardAvoidingView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
const screen = Dimensions.get('window');

const ShortsCommentModal = ({ commentModal, handleCommentModal }) => {
    return(
        <Modal
            style={{margin: 0}}
            isVisible={commentModal}
            animationIn={"slideInUp"}
            onSwipeComplete={handleCommentModal}
            swipeDirection={'down'}
            swipeThreshold={100}
            backdropColor='transparent'
            hasBackdrop={true}
            onBackdropPress={handleCommentModal}
        >
            <View style={{flex: 1}}>
                <View style={styles.commentMainView}>
                    <View style={styles.headerStyle}>
                        <Text style={styles.headerText}>Comments (100)</Text>
                        <TouchableOpacity onPress={handleCommentModal}>
                            <Ionicons name='close-outline' size={25}
                                      style={{position: 'absolute', alignSelf: 'flex-end', right: 10, bottom: -5}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileView}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TouchableWithoutFeedback>
                                <View>
                                    <View style={styles.innerProfileView}>
                                        <TouchableOpacity>
                                            <Image source={require('../../../assets/profile_dummy.jpg')}
                                                   style={styles.profileImage}/>
                                        </TouchableOpacity>
                                        <View style={styles.innerProfileText}>
                                            <View style={styles.userName}>
                                                <Text style={styles.userNameText}>Jain Mughal</Text>
                                                <View style={styles.icons}>
                                                    <TouchableOpacity>
                                                        <Ionicons name='heart-outline' size={15} style={{right: 20}}/>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Ionicons name='thumbs-down-outline' size={15}/>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={styles.commentView}>
                                                <Text style={styles.commentText}>Hello This is a nice video i want to
                                                    see
                                                    more
                                                    videos like this will you please add more videos like this so that i
                                                    can
                                                    see
                                                    more</Text>
                                            </View>
                                            <View style={styles.reply}>
                                                <Text>11H</Text>
                                                <TouchableOpacity>
                                                    <Text style={styles.replyButton}>Reply</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity>
                                                    <Text style={styles.ViewReplyButton}><Ionicons
                                                        name='caret-down-outline' size={18}/></Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.inputView}>
                    <TextInput style={styles.inputText} placeholder='Enter Comment ...'></TextInput>
                    <TouchableOpacity>
                        <Ionicons name='send-outline' size={25} style={{padding: 10}}/>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    commentMainView: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        height: screen.height/1.5,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    headerStyle: {
        top: 10,
    },
    headerText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    profileView: {
        padding: 10,
        top: 10,
    },
    innerProfileView: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    innerProfileText: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    userName: {
        left: 15,
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    userNameText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'brown'
    },
    commentView: {
        left: 15,
        width: screen.width/1.5,
    },
    commentText: {
        lineHeight: 20
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    reply: {
        top: 5,
        left: 15,
        flexDirection: 'row',
        justifyContent: "flex-start",
    },
    replyButton: {
        left: 20,
        fontWeight: 'bold'
    },
    ViewReplyButton: {
        left: 35,
    },
    inputView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: screen.height - 80,
        width: screen.width - 20,
        borderColor: 'brown',
        height: 50,
        borderWidth: 2,
        borderRadius: 50,
        left: 10,
    },
    inputText: {
        padding: 15
    }
})

export default ShortsCommentModal