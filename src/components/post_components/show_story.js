import React, {useEffect, useState} from 'react';
import {View, Image, Dimensions, TouchableWithoutFeedback, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ShowStory = (props) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(Array.from({length: props.stories.length}, () => 0));
    const width = (100/props.stories.length)

    const currentStory = props.stories[currentStoryIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prevProgress => {
                const newProgress = [...prevProgress];
                newProgress[currentStoryIndex] += 2;

                if (newProgress[currentStoryIndex] >= 100) {
                    clearInterval(interval);
                    if (currentStoryIndex < props.stories.length - 1) {
                        setCurrentStoryIndex(prevIndex => prevIndex + 1);
                    } else {
                        props.handleStoryModal()
                    }
                }

                return newProgress;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [currentStoryIndex]);

    const handleStoryPress = () => {
        console.log('here')
        if (currentStoryIndex < props.stories.length - 1) {
            setCurrentStoryIndex(prevIndex => prevIndex + 1);
            setProgress(Array.from({ length: props.stories.length }, () => 0));
        } else {
            props.handleStoryModal()
        }
    };

    return (
        <TouchableWithoutFeedback style={{flex: 1, justifyContent: 'center'}}
                                  onPress={handleStoryPress}>
            <View>
                <View style={{flexDirection: 'row'}}>
                    {props.stories.map((story, index) => (
                        <View
                            key={story.id}
                            style={{width: `${width}%`, height: 2, backgroundColor: 'grey' , marginRight: 5}}
                        >
                            <View
                                style={{
                                    width: `${progress[index]}%`,
                                    height: 2,
                                    backgroundColor: 'brown',
                                }}
                            />
                        </View>
                    ))}
                </View>
                <TouchableOpacity onPress={() => props.handleStoryModal()}>
                    <Ionicons name="close-outline" size={30} color="white" style={{ position: 'absolute', left: screenWidth - 30, top: 10}} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../../../assets/profile_dummy.jpg')} resizeMode='contain'
                           style={styles.userProfile}/>
                </TouchableOpacity>
                <Image source={currentStory.url} resizeMode='contain'
                       style={{width: screenWidth, height: screenHeight}}/>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ShowStory;

const styles = StyleSheet.create({
    userProfile: {
        marginTop: 15,
        marginRight: 15,
        marginLeft: 15,
        width: 50,
        height: 50,
        borderRadius: 50,
        position: 'absolute',
        borderColor: 'white',
        borderWidth: 2
    }
})

