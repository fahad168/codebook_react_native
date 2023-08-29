import React, {useEffect, useState} from 'react';
import {
    View,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator, Text
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video } from "expo-av";
import moment from "moment/moment";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ShowStory = (props) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(Array.from({length: props.stories.length}, () => 0));
    const [imageLoading, setImageLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [intervalId, setIntervalId] = useState(null)
    const [elapsedTime, setElapsedTime] = useState(0);

    const currentStory = props.stories[currentStoryIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            if (!imageLoading) {
                setProgress((prevProgress) => {
                    const newProgress = [...prevProgress];
                    newProgress[currentStoryIndex] += 2;

                    if (newProgress[currentStoryIndex] >= 100) {
                        clearInterval(interval);
                        if (currentStoryIndex < props.stories.length - 1) {
                            setCurrentStoryIndex((prevIndex) => prevIndex + 1);
                            setProgress(Array.from({ length: props.stories.length }, () => 0));
                        } else {
                            props.handleStoryModal();
                        }
                    }

                    return newProgress;
                });
                setElapsedTime((prevElapsedTime) => prevElapsedTime + (currentStory?.duration ? currentStory.duration / 60 : 100));
            }
        }, currentStory?.duration ? currentStory.duration/60 : 100);

        setIntervalId(interval)
        return () => clearInterval(interval);
    }, [currentStoryIndex, imageLoading]);

    // const wait = () => {
    //     clearInterval(intervalId)
    //     setIsPlaying(false)
    // }

    // const start = () => {
    //     const remainingDuration = currentStory?.duration ? currentStory.duration / 60 - elapsedTime : 100 - (elapsedTime / 1000);
    //     setProgress((prevProgress) => {
    //         const newProgress = [...prevProgress];
    //         newProgress[currentStoryIndex] = (100 * (1 - remainingDuration / (currentStory?.duration ? currentStory.duration / 60 : 100)));
    //
    //         return newProgress;
    //     });
    //     const newInterval = setInterval(() => {
    //         if (!imageLoading) {
    //             setProgress((prevProgress) => {
    //                 setIsPlaying(true)
    //                 const newProgress = [...prevProgress];
    //                 newProgress[currentStoryIndex] += 2;
    //
    //                 if (newProgress[currentStoryIndex] >= 100) {
    //                     clearInterval(newInterval);
    //                     if (currentStoryIndex < props.stories.length - 1) {
    //                         setCurrentStoryIndex((prevIndex) => prevIndex + 1);
    //                         setProgress(Array.from({ length: props.stories.length }, () => 0));
    //                     } else {
    //                         props.handleStoryModal();
    //                     }
    //                 }
    //
    //                 return newProgress;
    //             });
    //
    //             setElapsedTime((prevElapsedTime) => prevElapsedTime + (currentStory?.duration ? currentStory.duration / 60 : 100));
    //         }
    //     }, remainingDuration);
    //
    //     setIntervalId(newInterval);
    // };

    const handleStoryPress = () => {
        if (currentStoryIndex < props.stories.length - 1) {
            setCurrentStoryIndex(prevIndex => prevIndex + 1);
            setProgress(Array.from({ length: props.stories.length }, () => 0));
        } else {
            props.handleStoryModal()
        }
    };

    return (
        <TouchableWithoutFeedback style={{flex: 1, justifyContent: 'center'}}
                                  onPress={handleStoryPress}
        >
            <View style={{ width: '100%' }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    {props.stories.map((story, index) => (
                        <View
                            key={story.id}
                            style={{ flex: 1, height: 2, backgroundColor: (index !== currentStoryIndex && index < currentStoryIndex ? 'brown' : 'grey'), marginLeft: index !== 0 ? 3 : 0}}
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
                <TouchableOpacity style={{zIndex: 100}} onPress={() => props.handleStoryModal()}>
                    <Ionicons name="close-outline" size={30} color="white"
                              style={{position: 'absolute', left: screenWidth - 35, top: 10}}/>
                </TouchableOpacity>
                <TouchableOpacity style={{zIndex: 1, flexDirection: 'row'}}>
                    <View>
                        <Image
                            source={currentStory?.user?.profile_image ? {uri: currentStory?.user?.profile_image} : require('../../../assets/dummy_profile.png')}
                            resizeMode='contain'
                            style={styles.userProfile}/>
                    </View>
                    <View style={{left: 80, top: 18}}>
                        <Text style={{color: 'white', fontSize: 15}}>{currentStory?.user?.username}</Text>
                        <Text style={{
                            color: 'white',
                            fontSize: 12
                        }}>{moment(currentStory?.created_at).startOf("seconds").fromNow()}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ position: 'absolute'}}>
                    {imageLoading && <ActivityIndicator color='white' size={40} style={styles.loader}/>}
                    {
                        currentStory?.content_type.split('/')[0] === 'image' ?
                            <Image
                                source={{uri: currentStory?.story_image}}
                                resizeMode='contain'
                                style={{ width: screenWidth, height: screenHeight }}
                                onLoadStart={() => setImageLoading(true)}
                                onLoadEnd={() => setImageLoading(false)}
                            /> :
                            <Video
                                source={{uri: currentStory?.story_image}}
                                style={{width: screenWidth, height: screenHeight}}
                                onLoadStart={() => setImageLoading(true)}
                                onLoad={() => {setImageLoading(false); setIsPlaying(true)}}
                                resizeMode="contain"
                                shouldPlay={isPlaying}
                                isLooping={false}
                                useNativeControls={false}
                            />
                    }
                    <View style={{zIndex: 1, position: 'absolute', alignSelf: 'center'}}>
                        <Text style={styles.storyText}>{currentStory?.text}</Text>
                    </View>
                </View>
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
    },
    loader: {
        flex: 1,
        position: 'absolute',
        alignSelf: 'center',
        paddingVertical: screenHeight / 2
    },
    storyText: {
        color: 'brown',
        fontSize: 18,
        top: screenHeight - 100,
    }
})

