import {Share} from "react-native";

const ShareMedia = async (mediaUri) => {
    try {
        const response =  await Share.share({
            url: mediaUri,
            message: `${mediaUri}`,
            filename: 'media',
            type: 'image',
        });
        if (response.action === Share.sharedAction) {
            if (response.activityType) {
                console.log(`Media shared successfully via ${response.activityType}`);
            } else {
                console.log('Media shared successfully');
            }
        } else if (response.action === Share.dismissedAction) {
            console.log('Share menu dismissed');
        }
    } catch (error) {
        console.error(error);
    }
};

export default ShareMedia