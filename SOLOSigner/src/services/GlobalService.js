import {Linking, Platform} from "react-native";
import {Actions} from "react-native-router-flux";
import {
  FLAG_OAUTH2TOKEN,
  FLAG_WALLET_KEY,
  FLAG_APP_INFO_KEY
} from '../helpers/Constants';
import AsyncStorage from '../helpers/AsyncStorageUtils';
import {isWebPlatform} from "../helpers/PlatformUtils";


function checkExistingOAuth2Token() {
  AsyncStorage.getItem(FLAG_OAUTH2TOKEN, (error, result) => {
    if (result) {
      checkWalletExisting();
    } else {
      Actions.reset('keycloak');
    }
  });
}

function checkWalletExisting() {
  AsyncStorage.getItem(FLAG_WALLET_KEY, (error, result) => {
    if (result) {
      /* has wallet */
      Actions.reset('security_pin', {isNewPIN: false});
    } else {
      AsyncStorage.getItem(FLAG_APP_INFO_KEY, (error, result) => {
        console.log("Check Wallet exist: " + result);
        if (result && !result[0].pin) {
          console.log(result);
          Actions.reset('security_pin',{
            isNewPIN: false,
            encryptedWallet: true
          });
        } else {
          /* no wallet, create a new one */
          //Actions.reset('create_wallet');
          Actions.reset('security_pin', { isNewPIN: true });
        }
      });
    }
  });
}

function responseToReceiver(result, jsonData) {
    let responseData = {
        action: jsonData.action,
        result: result,
    };
    let responseUrl = '';
    if (isWebPlatform()) {
        var main = require('electron').remote.require("./main.js");
        main.handleMainRequest(responseData);
    } else {
      responseUrl = `${jsonData.receiver}://${JSON.stringify(responseData)}`;
      Linking.openURL(responseUrl).then().catch(error =>
                                                console.log(error)
                                               );
    }
}

function convertToHash(inputPIN){
    let pinString = null;
    if(typeof(responseData) === 'string'){
        pinString = inputPIN;
    } else {
        pinString = JSON.stringify(inputPIN);
    }
    var sha512 = require('js-sha512');
    let hashPin = sha512(pinString);
    return hashPin;
}

module.exports = {
    checkExistingOAuth2Token: checkExistingOAuth2Token,
    checkWalletExisting: checkWalletExisting,
    responseToReceiver: responseToReceiver,
    convertToHash: convertToHash
};
