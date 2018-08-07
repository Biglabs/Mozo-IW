import bip39 from 'bip39';
import {appDAO} from "../../dao/index";
import encryption from "../../helpers/EncryptionUtils";

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
function encryptWallet(pin, password) {
    let mnemonic = appDAO.getRawMnemonic(pin);
    if (mnemonic) {
        return encryption.encrypt(mnemonic, password);
    } else return null;
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
    ERROR,
    encryptWallet,
    restoreWallet,
}