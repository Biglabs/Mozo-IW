import {Linking, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Constant from '../common/Constants';
import DataManager from './DataManager';
import Globals from '../common/Globals';

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

function manageScheme(data, pin){
    console.log("Manage scheme: " + data);
    const jsonData = JSON.parse(decodeURI(data));
    console.log(jsonData);
    switch (jsonData.action) {
        case Constant.ACTION_SCHEME.SIGN: {
            console.log("Processing confirm transaction.");
            Actions.jump('trans_confirm', {txData: jsonData, pin: pin});
            break;
        }
        case Constant.ACTION_SCHEME.GET_WALLET: {
            console.log("Processing get wallet info.");
            setTimeout(
                () => {
                    let manager = DataManager.getInstance();
                    let walletInfo = manager.getWalletInfo();
                    if(walletInfo){
                        walletInfo = { walletId : walletInfo.walletId };
                        Globals.responseToReceiver(walletInfo, jsonData);
                    } else {
                        alert("This wallet is not registered. Try again.");
                    }
                },
                500
            );
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
    Globals.checkWalletExisting();
};

//For CASE: Launch app in the first time.
/* waiting for SplashScreen done. */

//For CASE: APP IN BACKGROUND
Linking.addEventListener('url', linkingListener);

module.exports = {
    handleOpenURL: handleOpenURL,
    manageScheme: manageScheme,
};