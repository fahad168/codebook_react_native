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
const Images = () => {
    const { token } = useSelector((state) => state.loginReducer);
    const focused = useIsFocused()
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        if(focused || isRefreshing){
            getImages()
        }
    }, [focused || isRefreshing])

    const handleRefresh = () => {
        setIsRefreshing(!isRefreshing)
    }

    const getImages= () => {
        setIsLoading(true)
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        };

        axios.get(`${Backend_Url}/users/post_images`, { headers })
            .then((res) => {
                setImages(res?.data?.post_images)
            })
            .catch((error) => {
            });
        setIsLoading(false)
    }

    const renderItem = ({item}) => (
        <TouchableWithoutFeedback>
            <Image
                source={{uri: item.post_image}}
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
                data={images}
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

export default Images