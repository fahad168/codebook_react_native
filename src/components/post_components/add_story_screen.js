import React, {useState} from "react";
import {
    ActivityIndicator,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    ScrollView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Backend_Url } from '@env'
import {Video} from "expo-av";
import {useSelector} from "react-redux";
import axios from "axios";
import Toast from "react-native-simple-toast";
const screen = Dimensions.get('window');

const AddStoryScreen = (props) => {
    const [storyText, setStoryText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useSelector((state) => state.loginReducer);
    const image = props.route.params.image[0].assets[0]
    let duration
    if(image.type === 'image'){
        duration = null
    }else{
        duration = props.route.params.image[0].assets[0].duration
    }


    const addStoryRequest = () => {
        setIsLoading(!isLoading)
        const headers = {
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        };
        let type;
        if(image.type === 'image'){
            type = 'image/jpg'
        }else {
            type = 'video/mp4'
        }
        const formData = new FormData();
        formData.append('story_image', {
            uri: image.uri,
            type: type,
            name: type,
        });
        formData.append('text', storyText)
        formData.append('duration', duration)
        axios
            .post(`${Backend_Url}/stories`, formData , {headers})
            .then((res) => {
                Toast.showWithGravity(res?.data?.story?.message, Toast.SHORT, Toast.BOTTOM);
                setIsLoading(false)
                props.navigation.goBack()
            })
            .catch((error) => console.log(error));
    }

    return(
        <ScrollView style={styles.storyContainer}>
            <View style={styles.innerStoryContainer}>
                <View>
                    <TouchableOpacity>
                        <Ionicons name="close-outline" size={40} color="brown"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.headerView}>
                    <Text style={styles.pageTitle}>Add Story</Text>
                </View>
            </View>
            <View style={styles.storyInnerContainer}>
                <TextInput style={styles.text}
                           multiline={false}
                           placeholder="Story Text...."
                           autoCorrect={false}
                           onChangeText={text => setStoryText(text)}
                ></TextInput>
            </View>
            <View style={styles.imageContainer}>
                <View style={styles.imageContainerInside}>
                    {
                        image.type === 'video' ?
                            <Video
                                source={{uri: `${image.uri}`}}
                                style={{ width: screen.width, height: 500 }}
                                resizeMode="contain"
                                isLooping
                                shouldPlay
                            /> :
                            <Image source={{uri: `${image.uri}`}}
                                   resizeMode='contain'
                                   style={{ width: screen.width, height: 500 }}
                            />
                    }
                </View>
            </View>
            {
                storyText === "" ?
                    <TouchableOpacity disabled style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}>
                        <View style={styles.disabledButton}>
                            <Text style={styles.buttonText}>Add Story</Text>
                        </View>
                    </TouchableOpacity> :
                    <TouchableOpacity style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}} onPress={addStoryRequest}>
                        <View style={styles.addStoryButton}>
                            {
                                isLoading ?
                                    <ActivityIndicator color='white' size={20} animating={isLoading} /> :
                                    <Text style={styles.buttonText}>Add Story</Text>
                            }
                        </View>
                    </TouchableOpacity>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    storyContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    innerStoryContainer: {
        flexDirection: 'row',
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: 'brown',
        borderWidth: 2
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'brown'
    },
    text: {
        color: 'black',
        margin: 15,
        height: 50,
        borderColor: 'black',
        borderBottomWidth: 1,
        padding: 15,
        textAlignVertical: 'top',
        fontSize: 15,
    },
    storyInnerContainer: {
        marginTop: 20
    },
    headerView: {
        flex: 1,
        alignSelf: 'center',
    },
    imageContainer: {
        flex: 1,
        top: 10
    },
    imageContainerInside: {
        width: screen.width,
    },
    addStoryButton: {
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

export default AddStoryScreen