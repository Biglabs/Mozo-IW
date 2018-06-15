import { Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';

function handleOpenURL(url) {
    if (url && url.startsWith('solosigner')) {
        console.log(url);
        // TODO handle solosigner scheme
        // Sample: solosigner://{toAdr : '', value : '', data : ''}
        let urls = url.split("://");
        if (urls.length > 1) {
            var value = urls[1];
            value = decodeURI(value);
            console.log(value);
            var obj = JSON.parse(JSON.stringify(value));
            console.log(`JSON data [${obj}]`);
            Actions.reset('trans_confirm', {txData : obj});
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