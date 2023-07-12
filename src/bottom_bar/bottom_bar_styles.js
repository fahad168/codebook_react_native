import {Dimensions} from "react-native";
const screenWidth = Dimensions.get('window').width;

const styles = {
    mainView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    circle: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#212121',
        alignSelf: 'flex-end',
        bottom: 3,
        left: 3,
        alignItems: 'center',
    },
    codeHome: {
        position: 'absolute',
        top: 6
    },
}

export default styles;
