import React, {useState} from "react";
import {
    ImageBackground,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Modal,
    TouchableWithoutFeedback, ScrollView, Image, ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Backend_Url } from '@env'
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import { Formik } from 'formik';
import axios from "axios";
import Toast from "react-native-simple-toast";

const screenHeight = Dimensions.get('window').height;

const SignUp = ({ navigation }) => {
    const [hidePassword, setHidePassword] = useState(true)
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true)
    const [imageModal, setImageModal] = useState(false)
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const handleModal = () => {
        setImageModal(!imageModal)
    }

    const userInfo = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };
    const validationSchema = yup.object({
        username: yup.string().label("username").required("Username is required"),
        email: yup.string().label("email").email("Email must be a valid email address").required("Email is required"),
        password: yup
            .string()
            .label("password")
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/^[^-\s]+$/, "* This field cannot contain only blank spaces"),
        confirmPassword: yup
            .string()
            .label("confirmPassword")
            .required("Password Confirmation is required")
            .oneOf([yup.ref("password")], "Passwords do not match")
            .min(8, "Password Confirmation must be at least 8 characters")
            .matches(/^[^-\s]+$/, "* This field cannot contain only blank spaces"),
    });

    const selectPhoto = async (key) => {
        let result
        if (key === 'select'){
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
        }else if(key === 'take'){
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            });
        }

        if (!result.canceled) {
            setImage(result);
            handleModal()
        }else{
            console.log('canceled')
        }
    }

    const emailValidation = (data) => {
        const headers = {
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
        };

        axios
            .get(`${Backend_Url}/users/email_validate?email=${data.email}`, {headers})
            .then((res) => {
                const formData = new FormData()
                if (image){
                    formData.append('profile_image', {
                        uri: image.assets[0].uri,
                        type: 'image/jpeg',
                        name: 'profile_image.jpg',
                    });
                }
                formData.append('username', data.username)
                formData.append('email', data.email)
                formData.append('password', data.password)
                formData.append('password_confirmation', data.confirmPassword)
                signUp(formData, headers)
            })
            .catch((error) => console.log(error));
    }

    const signUp = (formData, headers) => {
        axios
            .post(`${Backend_Url}/users`, formData , {headers})
            .then((res) => {
                navigation.navigate('LoginScreen')
                Toast.showWithGravity(res?.data?.message, Toast.SHORT, Toast.BOTTOM);
            })
            .catch((error) => console.log(error));
    }

    return(
        <ImageBackground source={require('../../../assets/gradient.png')} style={{ flex: 1 }}>
            <ScrollView>
                <View style={{height: screenHeight}}>
                    <View style={styles.mainHeaderView}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name='arrow-back-outline' size={30} color='brown' style={{margin: 10}}/>
                        </TouchableOpacity>
                        <View style={styles.headerView}>
                            <View style={{flex: 1}}>
                                <Text style={styles.headerViewText}>Sign Up</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleModal}>
                            {
                                image ?
                                    <Image source={{uri: `${image.assets[0].uri}`}} resizeMode='contain'
                                           style={styles.selectPic}/> :
                                    <View style={styles.selectPic}>
                                    <Ionicons name='add-outline' size={40} color='black'
                                              style={{alignSelf: 'center', top: 38}}/>
                                    </View>
                            }
                    </TouchableOpacity>
                    <Formik
                        initialValues={userInfo}
                        validationSchema={validationSchema}
                        onSubmit={(data) => {
                            emailValidation(data)
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, touched, errors}) => (
                            <View style={styles.mainView}>
                                <View>
                                    <Text style={styles.inputText}>Username</Text>
                                    <TextInput
                                        placeholder='e.g Alex'
                                        style={styles.input}
                                        onChangeText={handleChange('username')}
                                        onBlur={handleBlur('username')}
                                    />
                                    {touched.username && errors.username && <Text style={styles.warningMessage}>{errors.username}</Text>}
                                </View>
                                <View>
                                    <Text style={styles.inputText}>Email</Text>
                                    <TextInput
                                        placeholder='example@gmail.com'
                                        style={styles.input}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                    />
                                    {touched.email && errors.email && <Text style={styles.warningMessage}>{errors.email}</Text>}
                                </View>
                                <View>
                                    <Text style={styles.inputText}>Password</Text>
                                    <TextInput
                                        placeholder='Password....'
                                        style={styles.input}
                                        secureTextEntry={hidePassword}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                    />
                                    <TouchableOpacity style={styles.eyeIcon}
                                                      onPress={() => setHidePassword(!hidePassword)}>
                                        <Ionicons name={hidePassword ? 'eye-outline' : 'eye-off-outline'} size={25}/>
                                    </TouchableOpacity>
                                    {touched.password && errors.password && <Text style={styles.warningMessage}>{errors.password}</Text>}
                                </View>
                                <View>
                                    <Text style={styles.inputText}>Password Confirmation</Text>
                                    <TextInput
                                        placeholder='Password Confirmation....'
                                        style={styles.input}
                                        secureTextEntry={hideConfirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                    />
                                    <TouchableOpacity style={styles.eyeIcon}
                                                      onPress={() => setHideConfirmPassword(!hideConfirmPassword)}>
                                        <Ionicons name={hideConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                                  size={25}/>
                                    </TouchableOpacity>
                                    {touched.confirmPassword && errors.confirmPassword && <Text style={styles.warningMessage}>{errors.confirmPassword}</Text>}
                                </View>
                                <View style={{ flex: 1 }}>
                                    {
                                        isLoading ?
                                            <View style={styles.signUp}>
                                                <ActivityIndicator color='white' size={20} animating={isLoading} />
                                            </View> :
                                            <TouchableOpacity style={styles.signUp} onPress={() => {handleSubmit(); setIsLoading(!isLoading)}}>
                                                <Text style={styles.signUpText}>Sign Up</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
                <Modal visible={imageModal} animationType='slide' transparent={true}>
                    <TouchableWithoutFeedback onPress={handleModal}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => selectPhoto('select')}>
                                    <Ionicons name='images-outline' size={50} color='white'/>
                                    <Text style={styles.modalText}>Select Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => selectPhoto('take')}>
                                    <Ionicons name='camera-outline' size={50} color='white'/>
                                    <Text style={styles.modalText}>Take Photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    mainHeaderView: {
        borderBottomColor: 'brown',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderWidth: 1,
    },
    headerView: {
        flexDirection: 'row',
        position: 'absolute'
    },
    headerViewText: {
        textAlignVertical: 'center',
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'brown',
        fontSize: 20,
        top: 10,
    },
    mainView: {
        flex: 1,
        flexDirection: 'column',
        top: 50,
    },
    inputText: {
        marginLeft: 35,
        fontWeight: 'bold',
        fontSize: 15
    },
    input: {
        borderColor: 'black',
        borderWidth: 2,
        margin: 30,
        marginTop: 0,
        marginBottom: 15,
        padding: 10,
        paddingLeft: 15,
        color: 'black',
        borderRadius: 15,
        fontWeight: 'bold',
        fontSize: 15,
    },
    eyeIcon: {
        position: "absolute",
        alignSelf: 'flex-end',
        top: 35,
        right: 39,
    },
    selectPic: {
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 70,
        width: 130,
        height: 130,
        alignSelf: 'center',
        top: 20,
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
    signUp: {
        backgroundColor: 'brown',
        margin: 30,
        padding: 15,
        borderRadius: 15
    },
    signUpText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    warningMessage: {
        color: 'red',
        left: 35,
        bottom: 15
    }
})
export default SignUp