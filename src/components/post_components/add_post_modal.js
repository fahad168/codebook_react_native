import React, {useEffect, useState} from "react";
import {
    Modal,
    TouchableOpacity,
    View,
    StyleSheet,
    Text,
    Dimensions,
    TextInput,
    Image,
    ActivityIndicator,
    Alert
} from "react-native";
import ImageResizer from 'react-native-image-resizer';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Backend_Url } from '@env'
import axios from "axios";
import {useSelector} from "react-redux";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AddPostModal = (props) => {
    const [image, setImage] = useState(null);
    const [imageVisible, setImageVisible] = useState(false)
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useSelector((state) => state.loginReducer);
    const selectFile = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // allowsEditing: true,
            // aspect: [4, 4],
            // quality: 1,
        });

        if (!result.canceled) {
            setImage(result);
            setImageVisible(!imageVisible)
        }else{
            console.log('canceled')
        }
    }
    const createPost = async () => {
        setIsLoading(!isLoading)
        const formData = new FormData();
        const headers = {
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        };
        let type;
        if(image.type === 'image'){
            type = 'image/jpg'
        }else {
            type = 'video/mp4'
        }
        formData.append('post_image', {
            uri: image.assets[0].uri,
            type: type,
            name: type,
        });
        formData.append('description', description)
        axios
            .post(`${Backend_Url}/posts`, formData , {headers})
            .then((res) => {
                setImageVisible(!imageVisible)
                setIsLoading(false)
                props.toggleModal()
            })
            .catch((error) => console.log(error));
    }

    const takePicture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // allowsEditing: true,
            // aspect: [4, 3],
            // quality: 1,
        });
        if (!result.canceled) {
            setImage(result);
            setImageVisible(!imageVisible)
        }else{
            console.log('canceled')
        }
    }

    const cancelImage = () => {
        setImage(null)
        setImageVisible(!imageVisible)
    }

    return(
        <Modal visible={props.modalVisible} animationType="slide" transparent={true}>
            <View style={styles.postModalContainer}>
                <View style={styles.innerContainer}>
                    <View>
                        <TouchableOpacity onPress={props.toggleModal}>
                            <Ionicons name="close-outline" size={40} color="brown"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerView}>
                        <Text style={styles.modalTitle}>Add Post</Text>
                    </View>
                </View>
                <View style={styles.mainInnerContainer}>
                    <TextInput style={styles.description}
                               multiline={true}
                               placeholder="Post Description...."
                               autoCorrect={false}
                               onChangeText={description => setDescription(description)}
                    ></TextInput>
                </View>
                {
                    imageVisible ? <View>
                        <Text style={styles.selectedImagesText}>Selected Images</Text>
                        <View>
                            <TouchableOpacity style={{ zIndex: 1 }} onPress={cancelImage}>
                                <Ionicons name='close-outline' size={18} color='black' style={styles.closeIcon} />
                            </TouchableOpacity>
                            {
                                image.type === 'video' ?
                                    <Video
                                        source={{ uri: `${image.assets[0].uri}` }}
                                        style={styles.selectedVideoShow}
                                        resizeMode="contain"
                                        isLooping
                                        shouldPlay
                                    /> :
                                    <Image source={{uri: `${image.assets[0].uri}`}} style={ styles.selectedImageShow}/>
                            }
                        </View>
                    </View> : ''
                }
                <TouchableOpacity elevation={5} style={styles.selectImageContainer} onPress={selectFile}>
                    <View style={styles.selectImageView}>
                        <Ionicons name='image-outline' size={30} color='black' />
                        <Text style={styles.selectImage}>Select File From Gallery</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity elevation={5} style={styles.cameraImageContainer} onPress={takePicture}>
                    <View style={styles.selectImageView}>
                        <Ionicons name='camera-outline' size={30} color='black' />
                        <Text style={styles.selectImage}>Capture Image</Text>
                    </View>
                </TouchableOpacity>
                {
                    description === "" ?
                        <TouchableOpacity disabled style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}>
                            <View style={styles.disabledButton}>
                                <Text style={styles.buttonText}>Code Post</Text>
                            </View>
                        </TouchableOpacity> :
                        <TouchableOpacity style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}} onPress={createPost}>
                            <View style={styles.addPostButton}>
                                {
                                    isLoading ?
                                    <ActivityIndicator color='white' size={20} animating={isLoading} /> :
                                    <Text style={styles.buttonText}>Code Post</Text>
                                }
                            </View>
                        </TouchableOpacity>
                }
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    postModalContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    innerContainer: {
        flexDirection: 'row',
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: 'brown',
        borderWidth: 2
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'brown'
    },
    description: {
        color: 'black',
        margin: 15,
        height: screenHeight/3,
        borderColor: 'black',
        borderRadius: 8,
        borderWidth: 1,
        padding: 15,
        textAlignVertical: 'top',
        fontSize: 18,
    },
    mainInnerContainer: {
        marginTop: 20
    },
    headerView: {
        flex: 1,
        alignSelf: 'center',
    },
    selectImageContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        margin: 20,
        marginTop: 40,
    },
    cameraImageContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        margin: 20,
        marginTop: 5,
    },
    selectImageView: {
      flexDirection: 'row',
        justifyContent: "flex-start"
    },
    selectImage: {
        alignSelf: 'center',
        marginLeft: 10,
        color: 'black'
    },
    selectedImagesText: {
        marginLeft: 20,
        marginTop: 10,
    },
    selectedImageShow: {
        width: 70,
        height: 70,
        marginLeft: 20,
        marginTop: 5,
    },
    selectedVideoShow: {
        width: 80,
        height: 70,
        marginLeft: 20,
        marginTop: 5,
    },
    closeIcon: {
        position: 'absolute',
        zIndex: 1,
        marginLeft: 70,
        marginTop: 6,
    },
    addPostButton: {
        flexDirection: 'column',
        margin: 20,
        padding: 15,
        borderRadius: 8,
        backgroundColor: 'brown',
    },
    buttonText: {
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    disabledButton: {
        margin: 20,
        padding: 15,
        borderRadius: 8,
        backgroundColor: 'grey',
    },
})

export default AddPostModal