import {Platform} from "react-native";

import Constant from "../../helpers/Constants";
import PermissionUtils from "../../helpers/PermissionUtils";
import AsyncStorage from "../../helpers/AsyncStorageUtils";
import WalletBackupReference from './WalletBackupReference';

/**
 * Encrypt backup phrase (seed words) with password and save it to file
 *
 * @param {String}              fileType        Export file type. @see Constant.BACKUP_FILE_TYPE
 * @param {String}              encryptedData   Data for QR Code in encrypted status
 * @param {String}              qrCodeData      Data for generating QRCode image file
 * @returns {Promise<Boolean>}                  Result is true if backup success or otherwise
 */
async function backupWallet(fileType, encryptedData, qrCodeData) {
    let fileContent = qrCodeData.props.value;
    if(fileType === Constant.BACKUP_FILE_TYPE.TXT) {
        if (!encryptedData) {
            throw new Error(WalletBackupReference.ERROR.ENCRYPT_FAILED);
        }
        fileContent = encryptedData;
    }
    // call model for saving data
    saveBackupWallet(fileType, fileContent);
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
            } else throw new Error(WalletBackupReference.ERROR.USER_DENIED);
        })
        .then(backupFolderExisting => {
            /** And then: open file picker */

            let fileSelectorProps = {
                title: 'Choose backup file',
                filter: Platform.select({ios: [], android: ".*\\.png$|.*\\.txt$"}),
                onDone: (path) => doReadFile(path, callback)
            };

            //if (backupFolderExisting) fileSelectorProps.path = Constant.BACKUP_FOLDER;
            //RNFileSelector.Show(fileSelectorProps);
        })
        .catch(e => {
            // ignore error
        });
}

/**
 * Save QR Code data to file
 *
 * @param {String}              fileType        Export file type. @see Constant.BACKUP_FILE_TYPE
 * @param {String}              fileContent     Data for saving to file
 * @returns {Promise<boolean>}                  Result is true if backup success or otherwise
 */
function saveBackupWallet(fileType, fileContent) {    
    try {
        console.log("saveBackupWallet");
        //set data for main process
        AsyncStorage.setItem("file-content",fileContent);
        // userReference.set("file-content",fileContent);
        const ipc = require('electron').ipcRenderer;
        //send message to main process
        ipc.send('open-save-file-dialog',{fileType: fileType});
        AsyncStorage.setItem(Constant.FLAG_BACKUP_WALLET, 'true');
        // userReference.set(Constant.FLAG_BACKUP_WALLET, 'true');
    } catch (error) {
        console.log(error);
        throw err;
    }
}

module.exports = {
    ERROR: WalletBackupReference.ERROR,
    encryptWallet: WalletBackupReference.encryptWallet,
    restoreWallet: WalletBackupReference.restoreWallet,
    backupWallet: backupWallet,
    loadBackupFile: loadBackupFile,
};
