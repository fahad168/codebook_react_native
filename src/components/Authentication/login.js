import React, {useState} from "react";
import {
    ImageBackground,
    Text,
    View,
    StyleSheet,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Backend_Url } from '@env'
import {Formik} from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from 'react-redux';
import {userLogin} from "../../../redux/actions/action";
import Toast from "react-native-simple-toast";
const screenHeight = Dimensions.get('window').height;

const Login = ({ navigation }) => {
    const [hidePassword, setHidePassword] = useState(true)
    const dispatch = useDispatch();

    const loginInfo = {
        email: "",
        password: "",
    };
    const loginValidation = yup.object({
        email: yup.string().label("email").email("Email must be a valid email address").required("Email is required"),
        password: yup
            .string()
            .label("password")
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/^[^-\s]+$/, "* This field cannot contain only blank spaces"),
    });

    const login = (data) => {
        const headers = {
            Accept: "application/json",
            'Content-Type': 'multipart/form-data',
        };
        const formData = new FormData()
        formData.append('email', data.email)
        formData.append('password', data.password)
        axios.post(`${Backend_Url}/auth/login`, formData, {headers})
            .then((res) => {
                if (res?.status === 200){
                    var userInfo = {
                        ...res?.data?.user,
                        img: res?.data?.profile_image,
                    };
                    Toast.showWithGravity(res?.data?.message, Toast.SHORT, Toast.BOTTOM);
                    dispatch(userLogin(userInfo, res?.data?.token))
                }else{
                    Alert.alert("Error", res?.data?.message)
                }
            })
            .catch(error => {
                if (error?.response?.status === 422) {
                    Alert.alert("Error",'User not found');
                } else {
                    Alert.alert("Error", "Password is incorrect");
                }
            });
    }

    return(
        <ImageBackground source={require('../../../assets/gradient.png')} style={{flex: 1}}>
            <Formik
                initialValues={loginInfo}
                validationSchema={loginValidation}
                onSubmit={(data) => {
                    login(data)
                }}
            >
                {({handleChange, handleBlur, handleSubmit, values, touched, errors}) => (
                    <>
                        <View style={styles.headerView}>
                            <Text style={styles.headerViewText}>Code<Text
                                style={styles.headerViewText1}>Book</Text></Text>
                        </View>
                        <View style={styles.mainView}>
                            <View>
                                <Text style={styles.inputText}>Email</Text>
                                <TextInput
                                    placeholder='Enter Email....'
                                    style={styles.input}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                />
                                {touched.email && errors.email &&
                                    <Text style={styles.warningMessage}>{errors.email}</Text>}
                            </View>
                            <View>
                                <Text style={styles.inputText}>Password</Text>
                                <TextInput
                                    placeholder='Enter Password....'
                                    style={styles.input}
                                    secureTextEntry={hidePassword}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                />
                                <TouchableOpacity style={styles.eyeIcon} onPress={() => setHidePassword(!hidePassword)}>
                                    <Ionicons name={hidePassword ? 'eye-outline' : 'eye-off-outline'} size={25}/>
                                </TouchableOpacity>
                                {touched.password && errors.password &&
                                    <Text style={styles.warningMessage}>{errors.password}</Text>}
                            </View>
                            <TouchableOpacity style={{flex: 1, alignSelf: 'flex-end', marginRight: 30}}>
                                <Text style={{fontWeight: 'bold', fontSize: 15}}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, top: screenHeight / 3, marginBottom: 20}}>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Don't have account </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                                    <Text style={{color: 'brown', textDecorationLine: 'underline'}}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.login} onPress={() => handleSubmit()}>
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    headerView: {
        alignSelf: 'center',
        top: 20,
    },
    headerViewText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    headerViewText1: {
        color: 'brown'
    },
    mainView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        top: screenHeight/4
    },
    inputText: {
        marginLeft: 35,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 15
    },
    input: {
        borderColor: 'black',
        borderWidth: 2,
        margin: 30,
        marginTop: 0,
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
        top: 43,
        right: 39,
    },
    login: {
        backgroundColor: 'brown',
        margin: 30,
        padding: 15,
        borderRadius: 20
    },
    loginText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    socialLogins: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    warningMessage: {
        color: 'red',
        left: 35,
        bottom: 28
    }
})

export default Login