import React, {useEffect, useState} from "react";
import PostComponent from "./post_component";
import {
    ScrollView,
    View,
    StyleSheet,
    Image,
    Text,
    Alert,
    FlatList,
    ActivityIndicator,
    RefreshControl, Dimensions
} from "react-native";
import { Backend_Url } from '@env'
import axios from "axios";
import {useIsFocused} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import { Logout } from "../../../redux/actions/action";

const LatestPosts = () => {
    // const latestPostFocused = useIsFocused()
    const dispatch = useDispatch()
    const { token, user } = useSelector((state) => state.loginReducer);
    const [latestPosts, setLatestPosts] = useState([])
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(true);
    const [isLoading, setIsLoading] = useState(false)
    useEffect(  () => {
        if (refreshing){
            getLatestPosts()
            setRefreshing(false);
        }
    }, [refreshing])

    const handleScroll = () => {
        getLatestPosts()
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
    }

    const handleIntersection = (inView) => {
        if (inView) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    const getLatestPosts = () => {
        setIsLoading(true)
        const headers = {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        };

         axios.get(`${Backend_Url}/posts?page=${page}`, { headers })
            .then((res) => {
                if (page === 1){
                    setLatestPosts(res?.data?.posts)
                    setPage(page + 1)
                    // setPage(prevPage => prevPage + 1);
                }else{
                    const newData = res?.data?.posts
                    const combineData = latestPosts.concat(newData.map(obj => ({ ...obj })));
                    setLatestPosts(combineData)
                    setPage(page + 1)
                }
            })
            .catch((error) => {
                if(error?.message === "Request failed with status code 401"){
                    Alert.alert("Error", "User not logged in")
                    dispatch(Logout())
                }
            });
        setIsLoading(false)
    }

    return (
        <View style={styles.latestPosts}>
            <FlatList
                data={latestPosts}
                renderItem={({item, index}) => <PostComponent post={item}/>}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                onEndReached={handleScroll}
                onEndReachedThreshold={1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />
        </View>
        // <View style={styles.latestPosts}>
        //     <ScrollView onScroll={handleScroll}>
        //         {
        //             isLoading ? <ActivityIndicator style={styles.loader}/> :
        //             latestPosts?.posts?.map((post) => (
        //                 <PostComponent post={post} />
        //             ))
        //         }
        //     </ScrollView>
        // </View>
    )
}

const styles = StyleSheet.create({
    latestPosts: {
        flex: 1,
    },
})

export default LatestPosts