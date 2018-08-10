import {Platform} from "react-native";

import Constant from "../../helpers/Constants";
import PermissionUtils from "../../helpers/PermissionUtils";
import { backupWallet as backupWalletDAO }from "../../models/Wallet";
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

module.exports = {
    ERROR: WalletBackupReference.ERROR,
    encryptWallet: WalletBackupReference.encryptWallet,
    restoreWallet: WalletBackupReference.restoreWallet,
    backupWallet: backupWallet,
    loadBackupFile: loadBackupFile,
};
