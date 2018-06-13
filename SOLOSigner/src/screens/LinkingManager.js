import { Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';

function handleOpenURL(url) {
    if (url && url.startsWith('solosigner')) {
        // TODO handle solosigner scheme
        console.log(url);
        Actions.replace('tab_bip44');
    }
};

let linkingListener = event => {
    //Linking.removeEventListener('url', linkingListener);
    handleOpenURL(event.url);
}

//For CASE: Launch app in the first time.
/* waiting for SplashScreen done. */

//For CASE: APP IN BACKGROUND
Linking.addEventListener('url', linkingListener);

module.exports = {
    SchemeHandler: handleOpenURL
}