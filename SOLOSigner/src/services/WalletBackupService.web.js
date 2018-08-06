import {AsyncStorage, Platform} from "react-native";
import bip39 from 'bip39';

import Constant from "../helpers/Constants";
import PermissionUtils from "../helpers/PermissionUtils";
import encryption from "../helpers/EncryptionUtils";
import WalletService from "./WalletService.web";
import { backupWallet as backupWalletDAO }from "../models/Wallet";


const ERROR = {
    ENCRYPT_FAILED: 'encrypt failed',
    USER_DENIED: 'user denied',
};

/**
 * Load backup phrase (seed words) from local storage and encrypt it with password
 *
 * @param {string} pin          Security Pin for unlock local data
 * @param {string} password     Password to encrypt wallet
 * @returns {string}            Return encrypted string or null if backup phrase not existing
 */
function getEncryptedWallet(pin, password) {
    let mnemonic = WalletService.viewBackupPhrase(pin);
    if (mnemonic) {
        return encryption.encrypt(mnemonic, password);
    } else return null;
}

/**
 * Encrypt backup phrase (seed words) with password and save it to file
 *
 * @param {String}              encryptedData   Data for QR Code in encrypted status
 * @param {String}              pin             Security Pin for unlock local data
 * @param {String}              encryptPassword Password to encrypt wallet
 * @param {String}              fileType        Export file type. @see Constant.BACKUP_FILE_TYPE
 * @param {String}              qrCodeData      Data for generating QRCode image file
 * @returns {Promise<Boolean>}                  Result is true if backup success or otherwise
 */
async function backupWallet(encryptedData, pin, encryptPassword, fileType, qrCodeData) {
    let fileContent = qrCodeData.props.value;
    console.log(fileType.toUpperCase() === Constant.BACKUP_FILE_TYPE.TXT.toUpperCase());
    if(fileType.toUpperCase() === Constant.BACKUP_FILE_TYPE.TXT.toUpperCase()) {
        console.log("!encryptedData:" + encryptedData);
        if (!encryptedData) {
            encryptedData = getEncryptedWallet(pin, encryptPassword);
            console.log("encryptedData: " + encryptedData)
            if (!encryptedData){
                throw new Error(ERROR.ENCRYPT_FAILED);
            }
        }
        fileContent = encryptedData;
    }
    // call model for saving data
    backupWalletDAO(fileType, fileContent);
}

/////////////////// RESTORE WALLET ///////////////////

/**
 * Read and return encrypted data to @callback from selected file
 * @access private
 *
 * @param {string}      path        File's path
 * @param {function}    callback    Get encrypted data from selected file
 */
function doReadFile(path, callback) {
    if (path && path.toLowerCase().endsWith('png')) {
        //base64
        // TODO: decode QRCode image file
    } else if (path && path.toLowerCase().endsWith('txt')) {
        /* RNFileSystem.readFile(path, 'utf8').then(data => {
            callback && callback(data);
        }); */
    }
}

/**
 * Load file from local storage to restore wallet
 *
 * @param {function}    callback    Get encrypted data from selected file
 */
function loadBackupFile(callback) {
    PermissionUtils.requestStoragePermission()
        .then(granted => {
            if (granted) {
                /** First: check backup folder is exist */
                //return RNFileSystem.exists(Constant.BACKUP_FOLDER);
            } else throw new Error(ERROR.USER_DENIED);
        })
        .then(backupFolderExisting => {
            /** And then: open file picker */

            let fileSelectorProps = {
                title: 'Choose backup file',
                filter: Platform.select({ios: [], android: ".*\\.png$|.*\\.txt$"}),
                onDone: (path) => doReadFile(path, callback)
            };

            if (backupFolderExisting) fileSelectorProps.path = Constant.BACKUP_FOLDER;
            //RNFileSelector.Show(fileSelectorProps);
        })
        .catch(e => {
            // ignore error
        });
}

/**
 * Restore wallet from encrypted phrase (seed words) with password
 *
 * @param {string}  data        Encrypted phrase data
 * @param {string}  password    Password for decrypt
 * @returns {string}            Return backup phrase (seed words) as raw string or return null if decrypt fail
 */
function restoreWallet(data, password) {
    const result = encryption.decrypt(data, password);
    if (bip39.validateMnemonic(result)) return result;
    else return null;
}

module.exports = {
    ERROR: ERROR,
    getEncryptedWallet: getEncryptedWallet,
    backupWallet: backupWallet,

    loadBackupFile: loadBackupFile,
    restoreWallet: restoreWallet,
};
/* export default {
    ERROR: ERROR,
    getEncryptedWallet: getEncryptedWallet,
    backupWallet: backupWallet,

    loadBackupFile: loadBackupFile,
    restoreWallet: restoreWallet,
} */

