import React from 'react';
import {Button, Text, View, StyleSheet} from 'react-native'

const AddPostScreen = ({navigation}) => {
    const closeModal = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Modal Screen</Text>
            <Button title="Close Modal" onPress={closeModal} />
        </View>
    );
}

export default AddPostScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
    },
});