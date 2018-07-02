import {AsyncStorage, Linking} from "react-native";
import {Actions} from "react-native-router-flux";
import {FLAG_DB_EXISTING} from './Constants';

function checkWalletExisting() {
    AsyncStorage.getItem(FLAG_DB_EXISTING, (error, result) => {
        if (result === 'true') {
            /* has wallet */
            Actions.reset('security_pin', {isNewPIN: false});
        } else {
            /* no wallet, create a new one */
            Actions.reset('welcome');
        }
    });
}

function responseToReceiver(result, jsonData) {
    let responseData = {
        action: jsonData.action,
        result: result,
    };
    const responseUrl = `${jsonData.receiver}://${JSON.stringify(responseData)}`;
    Linking.openURL(responseUrl).then().catch(error => 
        console.log(error)
    );
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
    checkWalletExisting: checkWalletExisting,
    responseToReceiver: responseToReceiver,
    convertToHash: convertToHash
};