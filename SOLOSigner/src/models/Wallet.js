import bip39 from 'bip39';
import Bitcoin from 'bitcoinjs-lib';

import { updateMnemonicWithPin } from "../models/App";

import Constant from "../helpers/Constants";
import WebConstants from "../helpers/WebConstants";

import encryption from '../helpers/EncryptionUtils';
// import { checkDirectorySync } from "../helpers/PlatformUtils";

const userReference = require('electron').remote.require('electron-settings');

/**
 * Get Wallet information
 */
function getWalletInfo() {
    if(userReference.has(WebConstants.WALLET_SCHEMA)) {
        return userReference.get(WebConstants.WALLET_SCHEMA);
    }
    return null;
}

/**
 * Save Wallet Information
 *
 * @param { Object } walletInfo
 * @returns {Boolean} true if success, false if fail
 */
function saveWalletInfo(walletInfo) {
    try {
        if(userReference.has(WebConstants.WALLET_SCHEMA)) {
            userReference.delete(WebConstants.WALLET_SCHEMA);
        }
        userReference.set(WebConstants.WALLET_SCHEMA, walletInfo);
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
}


/**
 * Returns the standard derivation path in bip44 format.
 * The output of this function can be use to create a key pair.
 * @param {String} _coinType
 * @param {Int} _accountIndex
 * @param {_chain} _chain
 * @returns {String}
 */
function standardDerivationPath (_coinType, _accountIndex, _chain) {
    // Default is 0
    let accountIndex = _accountIndex || 0;
    // Default is external
    let chain = _chain || 0;
    return `m/44'/${_coinType}'/${accountIndex}'/${chain}`;
}

/**
 * Generate a list of keypair (wallet) according to each derivation path.
 * @param {String} mnemonic
 * @param {Array} coinTypes
 * @return {Array}
 */

function generateWallets (mnemonic, coinTypes){
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    let wallets = [];
    coinTypes.map(coinType => {
        let rootKey = coinType == Constant.COIN_TYPE.BTC_TEST ? Bitcoin.HDNode.fromSeedHex(seed, Bitcoin.networks.testnet) : Bitcoin.HDNode.fromSeedHex(seed);
        let path = standardDerivationPath(coinType.value);
        let wallet = rootKey.derivePath(path);
        wallets.push(wallet);
    });
    return wallets;
}

/**
 * Return a list of keypair (wallet) following a list of coin type.
 * A mnemonic string will be used in this process and stored to local db in encryption for backup purpose.
 * @param {String} importedPhrase
 * @param {String} pin
 * @param {Array} coinTypes
 * @return {Array}
 */
function createNewWallet  (importedPhrase, pin, coinTypes) {
    let mnemonic = importedPhrase || 
        bip39.generateMnemonic(128, null, bip39.wordlists.english);
    // Save PIN and mnemonic
    let encryptedMnemonic = encryption.encrypt(mnemonic, pin);
    // manager.updateMnemonicWithPin(encryptedMnemonic, pin);
    updateMnemonicWithPin(encryptedMnemonic, pin);

    let wallets = generateWallets(mnemonic, coinTypes);
    return wallets;
}

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
 * Save QR Code data to file
 *
 * @param {String}              fileType        Export file type. @see Constant.BACKUP_FILE_TYPE
 * @param {String}              fileContent     Data for saving to file
 * @returns {Promise<boolean>}                  Result is true if backup success or otherwise
 */
function backupWallet(fileType, fileContent) {    
    try {
        //set data for main process
        userReference.set("file-content",fileContent);
        const ipc = require('electron').ipcRenderer;
        //send message to main process
        ipc.send('open-save-file-dialog',{fileType: fileType});
        userReference.set(Constant.FLAG_BACKUP_WALLET, 'true');
    } catch (error) {
        console.log(error);
        throw err;
    }
}


module.exports = {
    saveWalletInfo: saveWalletInfo,
    createNewWallet: createNewWallet,
    backupWallet: backupWallet,
};