import { PlatformUtils } from "../helpers/PlatformUtils";
import { AsyncStorage } from "react-native";

// get reference to global electron-setting objects
const settings = require('electron').remote.require('electron-settings');


/**
 * Save key and value to disk
 * @param {String} key
 * @param {String} value
 */
function setKey(key, value) {
    if (PlatformUtils.isWebFlatform()) {
        settings.set(key, value);
    } else {
        AsyncStorage.setItem(key, value);
    }
}

function getKey(key, value) {
    if (PlatformUtils.isWebFlatform()) {
        settings.get(key, value);
    } else {
        AsyncStorage.getItem(key, value);
    }
}

function hasKey(key){
    if (PlatformUtils.isWebFlatform()) {
        settings.has(key, value);
    } else {
        AsyncStorage.setItem(key, value);
    }
}

module.exports = {
    setKey : setKey,
};