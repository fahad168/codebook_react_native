import {Dimensions} from "react-native";
const screenWidth = Dimensions.get('window').width;

const styles = {
    mainView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    circle: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#212121',
        alignSelf: 'flex-end',
        bottom: 3,
        left: 5,
        alignItems: 'center',
    },
    codeHome: {
        position: 'absolute',
        top: 4
    },
}

export default styles;
