import {Linking, Platform} from "react-native";
import {Actions} from "react-native-router-flux";
import {FLAG_DB_EXISTING} from '../helpers/Constants';
import AsyncStorage from '../helpers/AsyncStorageUtils';

function checkWalletExisting() {

    
    AsyncStorage.getItem(FLAG_DB_EXISTING, (error, result) => {
        if (result === 'true') {
            /* has wallet */
            Actions.reset('security_pin', {isNewPIN: false});
        } else if (result === 'false') {
            /* no wallet, create a new one */
            Actions.reset('welcome');
        } else {
            // TODO: reload app
            console.log(`System error related to IO: ${result}`);
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