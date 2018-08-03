import { Platform } from "react-native";
import { fs } from "fs";

/**
 * check if current platform is WEB
 */
function isWebPlatform() {
    return Platform.OS.toUpperCase() === "WEB";
}

/**
 * check if directory existed. if it does not exist, create a new one
 * @param {String} directory 
 */
function createDirectorySync(directory) {  
    try {
        fs.statSync(directory);
    } catch(e) {
        fs.mkdirSync(directory);
    }
}

/**
 * export function to outside
 */
module.exports = {
    isAndroid : Platform.OS === 'android',
    isWebPlatform : isWebPlatform,
    checkDirectorySync: createDirectorySync,
    //getFilePathFromUser: getFilePathFromUser,
};