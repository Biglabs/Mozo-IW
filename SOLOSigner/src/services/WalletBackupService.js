import {AsyncStorage, Platform} from "react-native";
import RNFileSystem from "react-native-fs";
import RNShare from "react-native-share";
import RNFileSelector from "react-native-file-selector";
import bip39 from 'bip39';

import Constant from "../helpers/Constants";
import encryption from "../helpers/EncryptionUtils";
import PermissionUtils from "../helpers/PermissionUtils";
import {isIOS} from '../helpers/PlatformUtils';
import {appDAO} from "../dao";

const ERROR = {
    ENCRYPT_FAILED: 'encrypt failed',
    USER_DENIED: 'user denied',
};

let ANDROID_BACKUP_FOLDER = `${RNFileSystem.ExternalStorageDirectoryPath}/Documents/SoloSigner`;

/**
 * Load backup phrase (seed words) from local storage and encrypt it with password
 *
 * @param {string} pin          Security Pin for unlock local data
 * @param {string} password     Password to encrypt wallet
 * @returns {string}            Return encrypted string or null if backup phrase not existing
 */
export function getEncryptedWallet(pin: string, password: string) {
    let mnemonic = appDAO.getRawMnemonic(pin);
    if (mnemonic) {
        return encryption.encrypt(mnemonic, password);
    } else return null;
}

/**
 * Encrypt backup phrase (seed words) with password and save it to file
 *
 * @param {string}              pin             Security Pin for unlock local data
 * @param {string}              encryptPassword Password to encrypt wallet
 * @param {BACKUP_FILE_TYPE}    fileType        Export file type. @see Constant.BACKUP_FILE_TYPE
 * @param {string}              qrCodeBase64    Base64 content for export QRCode image file
 * @returns {Promise<boolean>}                  Result is true if backup success or otherwise
 */
async function backupWallet(pin: string, encryptPassword: string, fileType: Constant.BACKUP_FILE_TYPE, qrCodeBase64?: string) {
    if (!this.encryptedData) {
        this.encryptedData = this.getEncryptedWallet(pin, encryptPassword);
        if (!this.encryptedData) throw new Error(ERROR.ENCRYPT_FAILED);
    }

    const today = new Date();
    const filePath = `${ANDROID_BACKUP_FOLDER}/backup_wallet_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}.${fileType}`;

    await PermissionUtils.requestStoragePermission()
        .then(granted => {
            if (granted) {
                /** First: check backup folder is exist */
                return isIOS || RNFileSystem.exists(ANDROID_BACKUP_FOLDER);
            } else throw new Error(ERROR.USER_DENIED);
        })
        .then(backupFolderExisting => {
            /** And then: create backup folder if not existing */
            return backupFolderExisting || RNFileSystem.mkdir(ANDROID_BACKUP_FOLDER);
        })
        .then(() => {
            /** And then: save files to local storage */
            switch (fileType) {
                case Constant.BACKUP_FILE_TYPE.PNG:
                    return isIOS || RNFileSystem.writeFile(filePath, qrCodeBase64, 'base64');
                case Constant.BACKUP_FILE_TYPE.TXT:
                    return RNFileSystem.writeFile(filePath, this.encryptedData);
            }
        })
        .then(() => {
            /** And then: open Share menu allows save files to another place  */
            let exportPngOnIOS = fileType === Constant.BACKUP_FILE_TYPE.PNG && isIOS;
            let shareOptions = {
                url: exportPngOnIOS ? `data:image/jpg;base64,${qrCodeBase64}` : `file://${filePath}`,
            };
            console.log('Share backup wallet: ' + JSON.stringify(shareOptions));
            return RNShare.open(shareOptions);
        })
        .then(() => {
            /** And then: save the state that the wallet is already backup */
            AsyncStorage.setItem(Constant.FLAG_BACKUP_WALLET, 'true');
            return true;
        })
        .catch(err => {
            throw err;
        });
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
        RNFileSystem.readFile(path, 'utf8').then(data => {
            callback && callback(data);
        });
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
                return RNFileSystem.exists(ANDROID_BACKUP_FOLDER);
            } else throw new Error(ERROR.USER_DENIED);
        })
        .then(backupFolderExisting => {
            /** And then: open file picker */

            let fileSelectorProps = {
                title: 'Choose backup file',
                filter: Platform.select({ios: [], android: ".*\\.png$|.*\\.txt$"}),
                onDone: (path) => doReadFile(path, callback)
            };

            if (backupFolderExisting) fileSelectorProps.path = ANDROID_BACKUP_FOLDER;
            RNFileSelector.Show(fileSelectorProps);
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

export default {
    ERROR: ERROR,
    getEncryptedWallet: getEncryptedWallet,
    backupWallet: backupWallet,

    loadBackupFile: loadBackupFile,
    restoreWallet: restoreWallet,
}