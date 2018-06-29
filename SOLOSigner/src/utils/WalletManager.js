import Constant from '../common/Constants';
import DataManager from '../utils/DataManager';
import Bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'bip39';
import encryption from '../common/encryption';
import {AsyncStorage} from 'react-native';

createNewWallet = function(manager, importedPhrase, pin, coinTypes) {
    let mnemonic = importedPhrase || 
        // "test pizza drift whip rebel empower flame mother service grace sweet kangaroo"; 
        bip39.generateMnemonic(128, null, bip39.wordlists.english);
    // Save PIN and mnemonic
    let encryptedMnemonic = encryption.encrypt(mnemonic, pin);
    manager.updateMnemonicWithPin(encryptedMnemonic, pin);
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    let rootKey = Bitcoin.HDNode.fromSeedHex(seed);
    let wallets = [];
    coinTypes.map(coinType => {
        let _rootKey = rootKey;
        let wallet = _rootKey.derivePath(`m/44'/${coinType}'/0'/0`);
        wallets.push(wallet);
    });
    // let wallet = rootKey.derivePath("m/44'/60'/0'/0");
    return wallets;
}

getAddressAtIndex = function(wallet, index) {
    try {
        let userWallet = wallet.derive(index);
        var keyPair = userWallet.keyPair;
        var privKeyBuffer = keyPair.d.toBuffer(32);
        var privkey = privKeyBuffer.toString('hex');
        var ethUtil = require('ethereumjs-util');
        var addressBuffer = ethUtil.privateToAddress(privKeyBuffer);
        var hexAddress = addressBuffer.toString('hex');
        var checksumAddress = ethUtil.toChecksumAddress(hexAddress);
        var address = ethUtil.addHexPrefix(checksumAddress);
        console.log("Ethereum address: [" + address + "]");
        privkey = ethUtil.addHexPrefix(privkey);
        return {address: address, derivedIndex: index, privkey: privkey};
    } catch (error) {
        console.error(error);
    }
    return null;
}

saveAddressToLocal = function(manager, coinType, walletData, pin) {
    // Because this is the first time when app is launched, data must be save to local
    // Save address and private key
    // Encrypt private key before saving to DB, password: pin
    let encryption = require('../common/encryption');
    let encryptedPrivateKey = encryption.encrypt(walletData.privkey, pin);
    manager.addAddress(coinType, walletData.address, walletData.derivedIndex, encryptedPrivateKey);
    // TODO: Load all addresses of this wallet from server and save to local
}

registerWalletAndSyncAddress = function(manager, publicKey, address, derivedIndex, callback) {
    console.log("Check wallet");
    manager.getExistingWalletFromServer(publicKey).then(walletInfo => {
        console.log('Wallet is registered.');
        // Save Wallet Info - WalletId
        manager.saveWalletInfo(walletInfo).then(result => {
            AsyncStorage.removeItem(Constant.FLAG_PUBLIC_KEY);
            if (typeof callback === 'function') {
                callback(null, result);
            }
        });
    }).catch((error) => {
        // Offline mode: Can not check wallet
        // Store public key for the next registration
        AsyncStorage.setItem(Constant.FLAG_PUBLIC_KEY, publicKey);
        if (error.isTimeOut !== 'undefined' && error.isTimeOut) {
            console.log('Check fail, timeout', error);
        } else {
            console.log('Register wallet');
            // Register wallet and save uid
            manager.registerWallet(publicKey).then((walletInfo) => {
                console.log('Wallet is registered.');
                // Save Wallet Info - WalletId
                manager.saveWalletInfo(walletInfo).then(result => {
                    // Synchronize address to server
                    manager.syncAddress(address, walletInfo.walletId, derivedIndex, "ETH", "ETH_TEST");
                    //TODO: Should retry incase network error
                    AsyncStorage.removeItem(Constant.FLAG_PUBLIC_KEY);
                    if (typeof callback === 'function') {
                        callback(null, result);
                    }
                });
            }).catch((error) => {
                console.log('Register fail', error);
                if (typeof callback === 'function') {
                    callback(error, null);
                }
            });
        }
    });
}

module.exports.manageWallet = function(isNewPin, pin, importedPhrase, coinTypes, callback) {
    let manager = DataManager.getInstance();
    // Store isDbExisting true
    AsyncStorage.setItem(Constant.FLAG_DB_EXISTING, 'true');
    if (isNewPin) {
        // TODO: Set timer here for the next time when user have to re-enter PIN
        let isDefault = coinTypes ? false : true;
        if (isDefault) {
            coinTypes = [Constant.COIN_TYPE.BTC.value, Constant.COIN_TYPE.ETH.value];
        }
        let wallets = createNewWallet(manager, importedPhrase, pin, coinTypes);
        wallets.map((wallet, index) => {
            let publicKey = wallet.neutered().toBase58();
            let walletData = getAddressAtIndex(wallet, 0);
            saveAddressToLocal(manager, coinTypes[index], walletData, pin);
            // Check wallet is registered on server or not
            registerWalletAndSyncAddress(manager, publicKey, walletData.address, walletData.derivedIndex, (error, result) => {
                if (typeof callback === 'function') {
                    if (result) {
                        callback(null, result);
                    } else {
                        callback(error, null);
                    }
                }
            });
        });
    } else {
        //Compare PIN
        let isEqual = manager.checkPin(pin);
        if (isEqual) {
            // Check wallet is registered on server or not
            AsyncStorage.getItem(Constant.FLAG_PUBLIC_KEY, (error, result) => {
                if (!error && result) {
                    let publicKey = result;
                    let addresses = manager.getAllAddresses();
                    if (addresses && addresses.length > 0) {
                        let address = addresses[0];
                        registerWalletAndSyncAddress(manager, publicKey, address.address, address.derivedIndex, (error, result) => {
                            if (typeof callback === 'function') {
                                if (result) {
                                    callback(null, result);
                                } else {
                                    callback(error, null);
                                }
                            }
                        });
                    }
                } else {
                    if (typeof callback === 'function') {
                        callback(null, true);
                    }
                }
            });
        } else {
            if (typeof callback === 'function') {
                callback(new Error("Inputted PIN is not correct"), null);
            }
        }
    }
}

module.exports.viewBackupPharse = function(pin, callback) {
    let manager = DataManager.getInstance();
    let appInfo = manager.getAppInfo();
    if (appInfo) {
        let encryptedMnemonic = appInfo.mnemonic;
        let mnemonic = encryption.decrypt(encryptedMnemonic, pin);
        if (typeof callback === 'function') {
            callback(null, mnemonic);
        }
    } else {
        if (typeof callback === 'function') {
            callback(new Error("Inputted PIN is not correct"), null);
        }
    }
}

module.exports.backupWallet = function(pin, callback) {

}