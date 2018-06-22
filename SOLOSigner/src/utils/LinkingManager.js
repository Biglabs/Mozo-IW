import {Alert, Linking} from 'react-native';
import {Actions} from 'react-native-router-flux';
import DataManager from '../utils/DataManager';

const ACTION_NONE = "NONE";
const ACTION_GET_USER = "GET_USER";
const ACTION_SIGN = "SIGN";

function handleOpenURL(url) {
    if (url && String(url).startsWith('solosigner')) {
        let urls = url.split("://");
        if (urls.length > 1 && urls[1]) {
            const stringData = decodeURI(urls[1]);
            let jsonData = JSON.parse(stringData);

            console.log(`Scheme data: ${stringData}`);
            let manager = DataManager.getInstance();
            let data = manager.getUserInfo();
            if (!data) {
                //INCASE: Wallet is not registered.
            } else {
                //Wallet is registered.
                switch (jsonData.action) {
                    case ACTION_SIGN:
                        Actions.jump('trans_confirm', {txData: jsonData});
                        break;
                }
            }
        } else {
            Alert.alert(
                "Error",
                url,
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
            );
        }
    }
}

let linkingListener = event => {
    //Linking.removeEventListener('url', linkingListener);
    handleOpenURL(event.url);
};

//For CASE: Launch app in the first time.
/* waiting for SplashScreen done. */

//For CASE: APP IN BACKGROUND
Linking.addEventListener('url', linkingListener);

module.exports = {
    SchemeHandler: handleOpenURL
};