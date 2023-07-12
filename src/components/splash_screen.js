import React, { useEffect, useRef } from 'react';
import {View, Animated, Easing, StyleSheet, Text, ImageBackground} from 'react-native';

const SplashScreen = () => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;
    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animationSequence = Animated.sequence([
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.elastic(1),
                useNativeDriver: true,
            }),
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]);

        Animated.loop(animationSequence).start();
    }, [opacityValue, scaleValue, rotateValue]);

    const interpolatedRotate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    return (
        <ImageBackground source={require('../../assets/gradient.png')} style={styles.container}>
            <View>
                <Animated.View
                    style={[
                        styles.animationContainer,
                        {opacity: opacityValue, transform: [{scale: scaleValue}, {rotate: interpolatedRotate}]},
                    ]}
                >
                    <Text style={styles.text}>Codebook</Text>
                </Animated.View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default SplashScreen;