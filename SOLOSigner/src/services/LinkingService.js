import {Linking, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Constant from '../helpers/Constants';
import DataService from './DataService';
import CachingService from './CachingService';
import Globals from './GlobalService';

let handleEventOpenUrl = (event) => {
    let url = event.url;
    if (url) {
        let jsonData = handleOpenURL(url);
        CachingService.getInstance().setSchemeData(jsonData);
        Globals.checkWalletExisting(); // Open right screen
    }
}

function checkScheme(url) {
    if (url) {
        let jsonData = handleOpenURL(url);
        CachingService.getInstance().setSchemeData(jsonData);
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
            let manager = DataService.getInstance();
            let walletInfo = manager.getWalletInfo();
            if(walletInfo){
                walletInfo = { walletId : walletInfo.walletId };
                Globals.responseToReceiver(walletInfo, jsonData);
            } else {
                Globals.responseToReceiver({error: Constant.ERROR_TYPE.NO_WALLET_INFO}, jsonData);
            }
            break;
        }
        case Constant.ACTION_SCHEME.MANAGE_WALLET: {
            console.log("Processing manage wallet.");
            Actions.jump('add_wallet', {txData: jsonData, pin: pin});
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