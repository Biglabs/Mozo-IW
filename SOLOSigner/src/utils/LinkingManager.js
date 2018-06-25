import {Linking} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Constant from './Constants';
import {CheckHasWallet} from '../utils/Globals';

function handleOpenURL(url) {
    if (url && String(url).startsWith('solosigner')) {
        let urls = url.split("://");
        if (urls.length > 1 && urls[1]) {
            try {
                const jsonData = JSON.parse(decodeURI(urls[1]));
                switch (jsonData.action) {
                    case Constant.ACTION_SCHEME_SIGN:
                        Actions.jump('trans_confirm', {txData: jsonData});
                        break;
                }
                alert(`Scheme data: ${jsonData}`);
            }
            catch (err) {
            }
        }
    }
}

let linkingListener = event => {
    //Linking.removeEventListener('url', linkingListener);
    // handleOpenURL(event.url);
    CheckHasWallet();
};

//For CASE: Launch app in the first time.
/* waiting for SplashScreen done. */

//For CASE: APP IN BACKGROUND
Linking.addEventListener('url', linkingListener);

module.exports = {
    SchemeHandler: handleOpenURL
};