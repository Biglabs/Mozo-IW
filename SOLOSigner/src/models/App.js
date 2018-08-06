import * as Utils from "../helpers/EncryptionUtils";
import WebConstants from "../helpers/WebConstants";

const userReference = require('electron').remote.require('electron-settings');

/**
 * get data with key App
 * @returns { Object } AppInfo
 */
function getAppInfo(){
    if(userReference.has(WebConstants.APP_SCHEMA)) {
        return userReference.get(WebConstants.APP_SCHEMA);
    }
    return null;
}

/**
 * validate input pin and saved pin
 *
 * @param {*} expectedPin
 * @returns
 */
function checkPin(expectedPin){
    let appInfo = getAppInfo();
    if(appInfo && appInfo.pin) {
        let actualHashPin = appInfo.pin;
        let expectedHashPin = Utils.convertToHash(expectedPin);
        return expectedHashPin == actualHashPin;
    }
    return false;
}

/**
 *create new App information with pin and mnemonic
 *
 * @param { String } mnemonic
 * @param { String } hashPin
 */
function addMnemonicWithPin(mnemonic, hashPin){
    if(userReference.has(WebConstants.APP_SCHEMA)) {
        userReference.delete(WebConstants.APP_SCHEMA);
    }
    userReference.set(WebConstants.APP_SCHEMA, {
        "pin" : hashPin,
        "mnemonic": mnemonic
    });
}

/**
 * update app with new pin and mnemonic
 *
 * @param {String} mnemonic
 * @param {String} pin
 * @returns
 */
function updateMnemonicWithPin(mnemonic, pin){
    let hashPin = Utils.convertToHash(pin);
    //Add new
    addMnemonicWithPin(mnemonic, hashPin);
    return hashPin;
}


/**
 * expose to outside
 */
module.exports = {
    getAppInfo: getAppInfo,
    checkPin: checkPin,
    //addMnemonicWithPin: addMnemonicWithPin,
    updateMnemonicWithPin: updateMnemonicWithPin,
};
