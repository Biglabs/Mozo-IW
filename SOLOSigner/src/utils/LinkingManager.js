import {Linking, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Constant from '../common/Constants';
import DataManager from './DataManager';
import GlobalStorage from './GlobalStorage';
import Globals from '../common/Globals';

let handleEventOpenUrl = (event) => {
    let url = event.url;
    if (url) {
        let jsonData = handleOpenURL(url);
        GlobalStorage.getInstance().setSchemeData(jsonData);
        Globals.checkWalletExisting(); // Open right screen
    }
}

function checkScheme(url) {
    if (url) {
        let jsonData = handleOpenURL(url);
        GlobalStorage.getInstance().setSchemeData(jsonData);
    }
}

function handleOpenURL(url) {
    if (url && String(url).startsWith('solosigner')) {
        let urls = url.split("://");
        //TOO: Check receiver
        if (urls.length > 1 && urls[1]) {
            try {
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
            let manager = DataManager.getInstance();
            let walletInfo = manager.getWalletInfo();
            if(walletInfo){
                walletInfo = { walletId : walletInfo.walletId };
                Globals.responseToReceiver(walletInfo, jsonData);
            } else {
                alert("This wallet is not registered. Try again.");
            }
            break;
        }
        default: {
            console.log('Default case');
        }
    }
    // alert(`Scheme data: ${jsonData}`);

}

module.exports = {
    handleEventOpenUrl: handleEventOpenUrl,
    handleOpenURL: handleOpenURL,
    manageScheme: manageScheme,
    checkScheme: checkScheme
};