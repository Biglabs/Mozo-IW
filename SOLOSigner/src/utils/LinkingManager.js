import { Alert, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';

function handleOpenURL(url) {
    if (url && String(url).startsWith('solosigner')) {
        // URL format: solosigner://{"from": "", "to": "", "value": "0.03", "message": "hello", "receiver": "wallet-com.big_labs.solo.wallet"}
        let urls = url.split("://");
        if (urls.length > 1 && urls[1]) {
            const stringData = decodeURI(urls[1]);
            let jsonData = JSON.parse(stringData);

            console.log(`Scheme data: ${stringData}`);
            Actions.reset('trans_confirm', {txData : jsonData});
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