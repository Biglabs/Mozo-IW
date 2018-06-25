import {Linking, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Constant from './Constants';
import {checkWalletExisting} from '../utils/Globals';

function handleOpenURL(url) {
    if (url && String(url).startsWith('solosigner')) {
        let urls = url.split("://");
        //TOO: Check receiver
        if (urls.length > 1 && urls[1]) {
            try {
                // Save data to AsyncStorage
                AsyncStorage.setItem(Constant.FLAG_SCHEME_DATA, urls[1]);
                return urls[1];
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    return null;
}

function manageScheme(data){
    const jsonData = JSON.parse(decodeURI(data));
    switch (jsonData.action) {
        case Constant.ACTION_SCHEME.SIGN: {
            Actions.jump('trans_confirm', {txData: jsonData});
            break;
        }
        default: {
            console.log('Default case');
        }
    }
    // alert(`Scheme data: ${jsonData}`);

}

let linkingListener = event => {
    //Linking.removeEventListener('url', linkingListener);
    handleOpenURL(event.url);
    checkWalletExisting();
};

//For CASE: Launch app in the first time.
/* waiting for SplashScreen done. */

//For CASE: APP IN BACKGROUND
Linking.addEventListener('url', linkingListener);

module.exports = {
    handleOpenURL: handleOpenURL,
    manageScheme: manageScheme,
};