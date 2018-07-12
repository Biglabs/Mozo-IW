import {AsyncStorage, Platform} from "react-native";
import RNFileSystem from "react-native-fs";
import RNShare from "react-native-share";

import Constant from "../helpers/Constants";
import PermissionUtils from "../helpers/PermissionUtils";
import encryption from "../helpers/EncryptionUtils";
import WalletService from "./WalletService";

const ERROR = {
    ENCRYPT_FAILED: 'encrypt failed',
    USER_DENIED: 'user denied',
};

/**
 * Load backup phrase (seed words) from local storage and encrypt it with password
 *
 * @param pin Security Pin for unlock local data
 * @param password Password to encrypt wallet
 * @returns {string} Return encrypted string or null if backup phrase not existing
 */
function getEncryptedWallet(pin: string, password: string) {
    let mnemonic = WalletService.viewBackupPhrase(pin);
    if (mnemonic) {
        return encryption.encrypt(mnemonic, password);
    } else return null;
}

/**
 * Encrypt backup phrase (seed words) with password and save it to file
 *
 * @param pin Security Pin for unlock local data
 * @param encryptPassword Password to encrypt wallet
 * @param fileType Export file type
 * @param qrCodeBase64 Base64 content for export QRCode image file
 * @returns {Promise<boolean>} Result is true if backup success or otherwise
 */
async function backupWallet(pin: string, encryptPassword: string, fileType: Constant.BACKUP_FILE_TYPE, qrCodeBase64?: string) {
    if (!this.encryptedData) {
        this.encryptedData = getEncryptedWallet(pin, encryptPassword);
        if (!this.encryptedData) throw new Error(ERROR.ENCRYPT_FAILED);
    }

    const today = new Date();
    const filePath = `${Constant.BACKUP_FOLDER}/backup_wallet_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}.${fileType}`;

    await PermissionUtils.requestStoragePermission()
        .then(granted => {
            if (granted) {
                /** First: check backup folder is exist */
                return RNFileSystem.exists(Constant.BACKUP_FOLDER);
            } else throw new Error(ERROR.USER_DENIED);
        })
        .then(backupFolderExisting => {
            /** And then: create backup folder if not existing */
            return backupFolderExisting || RNFileSystem.mkdir(Constant.BACKUP_FOLDER);
        })
        .then(() => {
            /** And then: save files to local storage */
            switch (fileType) {
                case Constant.BACKUP_FILE_TYPE.PNG:
                    if (Platform.OS === 'ios') {
                        return true
                    } else {
                        return RNFileSystem.writeFile(filePath, qrCodeBase64, 'base64');
                    }
                case Constant.BACKUP_FILE_TYPE.TXT:
                    return RNFileSystem.writeFile(filePath, this.encryptedData);
            }
        })
        .then(() => {
            /** And then: open Share menu allows save files to another place  */
            let exportPngOnIOS = fileType === Constant.BACKUP_FILE_TYPE.PNG && Platform.OS === 'ios';
            let shareOptions = {
                url: exportPngOnIOS ? `data:image/jpg;base64,${qrCodeBase64}` : `file://${filePath}`,
            };
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

function restoreWallet(data, password) {
    return encryption.decrypt(data, password);
}

export default {
    ERROR: ERROR,
    getEncryptedWallet: getEncryptedWallet,
    backupWallet: backupWallet,
    restoreWallet: restoreWallet,
}