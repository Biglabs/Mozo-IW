import DataService from '../services/DataService';
/**
 * Validate input PIN from user with the current PIN in local DB.
 * @param {String} expectedPin
 */
export function checkPin(expectedPin){
    let appInfo = getAppInfo();
    if(appInfo && appInfo.pin) {
        let actualHashPin = appInfo.pin;
        let HashUtils = require("../helpers/HashUtils");
        let expectedHashPin = HashUtils.convertToHash(expectedPin);
        if(expectedHashPin == actualHashPin){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * Update mnemonic which is encrypted by using PIN
 * @param {String} mnemonic
 * @param {String} pin
 */
export function updateMnemonicWithPin(mnemonic, pin){
    let appInfo = getAppInfo();
    let HashUtils = require("../helpers/HashUtils");
    let hashPin = HashUtils.convertToHash(pin);
    let service = DataService.getInstance().constructor;
    if(appInfo){
        //Remove old PIN
        service.realm.write(() => {
            service.realm.delete(appInfo);
        });
    } 
    //Add new
    addMnemonicWithPin(mnemonic, hashPin);
    return hashPin;
}

/**
 * Insert encrypted mnemonic and pin to local DB
 * @param {String} mnemonic
 * @param {String} pin
 */
export function addMnemonicWithPin(mnemonic, hashPin){
    let service = DataService.getInstance().constructor;
    service.realm.write(() => {
        service.realm.create('App', { pin : hashPin, mnemonic : mnemonic });
    });
}

/**
 * Get app info and all related attributes
 */
function getAppInfo() {
    let service = DataService.getInstance().constructor;
    let apps = service.realm.objects('App');
    if(apps.length > 0) {
        return apps[0];
    }
    return null;
}

/**
 * Return raw mnemonic as a string with value is from local DB.
 * @param {String} pin
 */
export function getRawMnemonic(pin){
    let appInfo = getAppInfo();
    if (appInfo) {
        let encryption = require('../helpers/EncryptionUtils');
        return encryption.decrypt(appInfo.mnemonic, pin);
    }
    return null;
}