import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";
const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.title || route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[styles.tabItem, isFocused && styles.activeTabItem]}
                    >
                        <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    activeTabItem: {
        borderBottomWidth: 3,
        borderBottomColor: 'brown',
    },
    tabLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
    },
    activeTabLabel: {
        color: 'brown',
    },
})

export default CustomTabBar