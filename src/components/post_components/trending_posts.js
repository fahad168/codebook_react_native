import React from "react";
import PostComponent from "./post_component";
import {ScrollView, View, StyleSheet} from "react-native";

const TrendingPosts = () => {
    return (
        <View style={styles.trendingPosts}>
            <ScrollView>
                <PostComponent/>
                <PostComponent />
                <PostComponent />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    trendingPosts: {
        flex: 1,
    },
})

export default TrendingPosts