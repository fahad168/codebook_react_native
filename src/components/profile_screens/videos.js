import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from "react-native";
import axios from "axios";
import {useIsFocused} from "@react-navigation/native";
import {useSelector} from "react-redux";
import { Backend_Url } from '@env'
import {Video} from "expo-av";
const Videos = () => {
    const { token } = useSelector((state) => state.loginReducer);
    const focused = useIsFocused()
    const [isLoading, setIsLoading] = useState(false)
    const [videos, setVideos] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        if(focused || isRefreshing){
            getVideos()
        }
    }, [focused || isRefreshing])

    const handleRefresh = () => {
        setIsRefreshing(!isRefreshing)
    }

    const getVideos= () => {
        setIsLoading(true)
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        };

        axios.get(`${Backend_Url}/users/post_videos`, { headers })
            .then((res) => {
                setVideos(res?.data?.post_videos)
            })
            .catch((error) => {
            });
        setIsLoading(false)
    }

    const renderItem = ({item}) => (
        <TouchableWithoutFeedback>
            <Video
                source={{uri: item.post_video}}
                resizeMode='cover'
                style={styles.item}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
            />
        </TouchableWithoutFeedback>
    )

    return(
        <View style={styles.mainImageView}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={videos}
                renderItem={ renderItem }
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainImageView: {
        height: '100%'
    },
    item: {
        flex: 1,
        margin: 5,
        marginRight: 5,
        borderColor: '#ddd',
        borderWidth: 1,
        height: 120,
        width: 150
    },
    columnWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        height: 120,
        width: 120
    }
})

export default Videos