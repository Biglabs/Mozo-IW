// import {AsyncStorage} from 'react-native';
import RESTService, { syncAllAddress } from './RESTService';
import ethUtil from 'ethereumjs-util';
// import Web3 from 'web3';

//import Bitcoin from 'react-native-bitcoinjs-lib';
import Bitcoin from 'bitcoinjs-lib';

import bip39 from 'bip39';
import encryption from '../helpers/EncryptionUtils';

import Constant from '../helpers/Constants';
import DataService from './DataService.web';

import { saveWalletInfo } from "../models/Wallet";
import { checkPin } from "../models/App";
import { addAddress, getAllAddresses } from "../models/Addresses";

const userReference = require('electron').remote.require('electron-settings');


/**
 * Returns the standard derivation path in bip44 format.
 * The output of this function can be use to create a key pair.
 * @param {String} _coinType
 * @param {Int} _accountIndex
 * @param {_chain} _chain
 * @returns {String}
 */
/* standardDerivationPath = function(_coinType, _accountIndex, _chain) {
    // Default is 0
    let accountIndex = _accountIndex || 0;
    // Default is external
    let chain = _chain || 0;
    return `m/44'/${_coinType}'/${accountIndex}'/${chain}`;
} */


/**
 * Generate a list of keypair (wallet) according to each derivation path.
 * @param {String} mnemonic
 * @param {Array} coinTypes
 * @return {Array}
 */
/* generateWallets = function(mnemonic, coinTypes){
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    let wallets = [];
    coinTypes.map(coinType => {
        let rootKey = coinType == Constant.COIN_TYPE.BTC_TEST ? Bitcoin.HDNode.fromSeedHex(seed, Bitcoin.networks.testnet) : Bitcoin.HDNode.fromSeedHex(seed);
        let path = standardDerivationPath(coinType.value);
        let wallet = rootKey.derivePath(path);
        wallets.push(wallet);
    });
    return wallets;
} */


/**
 * Return a list of keypair (wallet) following a list of coin type.
 * A mnemonic string will be used in this process and stored to local db in encryption for backup purpose.
 * @param {DataService} manager
 * @param {String} importedPhrase
 * @param {String} pin
 * @param {Array} coinTypes
 * @return {Array}
 */
/* createNewWallet = function(manager, importedPhrase, pin, coinTypes) {
    let mnemonic = importedPhrase || 
        bip39.generateMnemonic(128, null, bip39.wordlists.english);
    // Save PIN and mnemonic
    let encryptedMnemonic = encryption.encrypt(mnemonic, pin);
    // manager.updateMnemonicWithPin(encryptedMnemonic, pin);
    updateMnemonicWithPin(encryptedMnemonic, pin);

    let wallets = generateWallets(mnemonic, coinTypes);
    return wallets;
} */

/**
 * Save an address to local DB with the encrypted private key.
 * @param {DataService} manager
 * @param {Address} address
 * @param {String} pin
 */
saveAddressToLocal = function(manager, address, pin) {
    // Because this is the first time when app is launched, data must be save to local
    // Save address and private key
    // Encrypt private key before saving to DB, password: pin
    let encryption = require('../helpers/EncryptionUtils');
    let encryptedPrivateKey = encryption.encrypt(address.privkey, pin);
    address.privkey = encryptedPrivateKey;
    // manager.addAddress(address);
    addAddress(address);
    // TODO: Load all addresses of this wallet from server and save to local
}

/**
 * Returns an account's address based on a specified coin type.
 * The output will include address and private key.
 * @param {KeyPair} wallet
 * @param {String} coinType
 * @param {Int} addressIndex 
 */
generateAddressAtIndex = function(wallet, coinType, addressIndex) {
    try {
        let userWallet = wallet.derive(addressIndex);
        var address = "";
        var privkey = "";
        var keyPair = userWallet.keyPair;
        if(coinType == Constant.COIN_TYPE.BTC.value || coinType == Constant.COIN_TYPE.BTC_TEST.value){
            address = keyPair.getAddress().toString();
            // get privkey
            var hasPrivkey = !userWallet.isNeutered();
            var privkey = "NA";
            if (hasPrivkey) {
                privkey = keyPair.toWIF();                
            }
        } else if (coinType == Constant.COIN_TYPE.ETH.value){
            // Ethereum values are different
            var privKeyBuffer = keyPair.d.toBuffer(32);
            privkey = privKeyBuffer.toString('hex');
            var addressBuffer = ethUtil.privateToAddress(privKeyBuffer);
            var hexAddress = addressBuffer.toString('hex');
            var checksumAddress = ethUtil.toChecksumAddress(hexAddress);
            address = ethUtil.addHexPrefix(checksumAddress);
            privkey = ethUtil.addHexPrefix(privkey);
        } else {
            //TODO: Support SOLO and MOZO
        }
        console.log("Address: [" + address + "]");
        return {address: address, addressIndex: addressIndex, privkey: privkey};
    } catch (error) {
        console.error(error);
    }
    return null;
}

/**
 * Check wallet is registered with server. If wallet is registered, we store the wallet info to local. 
 * If not, call API to register wallet.
 * @param {DataService} manager
 * @param {String} publicKey
 * @param {Array} addresses
 * @param {Callback} callback
 */
registerWalletAndSyncAddress = function(manager, publicKey, addresses, callback) {
    console.log("Check wallet");
    RESTService.getExistingWalletFromServer(publicKey, (error, result) => {
        if(result){
            console.log('Wallet is registered before.');
            storeWalletInfo(manager, result, addresses, (error, result) => {
                if (typeof callback === 'function') {
                    callback(error, result);
                }
            });
        } else {
            // Offline mode: Can not check wallet
            // Store public key for the next registration
            // AsyncStorage.setItem(Constant.FLAG_PUBLIC_KEY, publicKey);
            userReference.set(Constant.FLAG_PUBLIC_KEY, publicKey);

            if (error.isTimeOut !== 'undefined' && error.isTimeOut) {
                console.log('Check fail, timeout', error);
                if (typeof callback === 'function') {
                    callback(error, null);
                }
            } else {
                console.log('Register new wallet.');
                // Register wallet and save uid
                RESTService.registerWallet(publicKey).then((walletInfo) => {
                    console.log('Wallet is registered.');
                    storeWalletInfo(manager, walletInfo, addresses, (error, result) => {
                        if (typeof callback === 'function') {
                            callback(error, result);
                        }
                    });
                }).catch((error) => {
                    console.log('Register fail', error);
                    if (typeof callback === 'function') {
                        callback(error, null);
                    }
                });
            }
        }
    });
}

/**
 * Store wallet info to local DB, then synchronize all local addresses to server.
 * @param {DataService} manager
 * @param {String} publicKey
 * @param {Array} addresses
 * @param {Callback} callback
 */
storeWalletInfo = function(manager, walletInfo, addresses, callback){
    console.log("Store wallet info to local.")
    try {
        // AsyncStorage.removeItem(Constant.FLAG_PUBLIC_KEY);
        userReference.delete(Constant.FLAG_PUBLIC_KEY);

        if(saveWalletInfo(walletInfo)) {
            if (typeof callback === 'function') {
                callback(null, true);
            }
            console.log("Sync all local addresses to server.");
            RESTService.syncAllAddress(walletInfo.walletId, addresses);
        } else {
            throw "Fail to Save wallet !";
        }

    } catch (error) {
        console.log("Store wallet info error: " + error);
        if (typeof callback === 'function') {
            callback(error, null);
        }
    }
}

/**
 * Create a new wallet, addresses or import a wallet depending on current state.
 * @param {Bool} isNewPin
 * @param {String} pin
 * @param {String} importedPhrase
 * @param {Array} coinTypes
 * @param {Callback} callback
 */
module.exports.manageWallet = function(isNewPin, pin, importedPhrase, coinTypes, callback) {
    let manager = DataService.getInstance();
    // Store isDbExisting true
    // TODO: @apply desktop: save flag Constant.FLAG_DB_EXISTING
    //AsyncStorage.setItem(Constant.FLAG_DB_EXISTING, 'true');
    // DataService.userReference.set(Constant.FLAG_DB_EXISTING, 'true');
    userReference.set(Constant.FLAG_DB_EXISTING, 'true');

    if (isNewPin) {
        // TODO: Set timer here for the next time when user have to re-enter PIN
        let isDefault = coinTypes ? false : true;
        if (isDefault) {
            coinTypes = Constant.DEFAULT_COINS;
        }
        let wallets = createNewWallet(importedPhrase, pin, coinTypes); 

        let addresses = [];
        wallets.map((wallet, index) => {
            let coinType = coinTypes[index];
            let address = generateAddressAtIndex(wallet, coinType.value, 0); 
            address.accountIndex = 0;
            address.chainIndex = 0;
            address.coin = coinType.name;
            address.network = coinType.network;
            saveAddressToLocal(manager, address, pin);
            address.privkey = null;
            addresses.push(address);
        });
        //console.log("addAddress: " + addAddress);
        let publicKey = wallets[0].neutered().toBase58();
        registerWalletAndSyncAddress(manager, publicKey, addresses, (error, result) => { // TODO CHECKING
            if (typeof callback === 'function') {
                if (result) {
                    callback(null, result);
                } else {
                    callback(error, null);
                }
            }
        });
    } else {
        //Compare PIN
        let isEqual = checkPin(pin);
        if (isEqual) {
            // Check wallet is registered on server or not
            let result = userReference.get(Constant.FLAG_PUBLIC_KEY);
            if (result) {
                let publicKey = result;
                let addresses = getAllAddresses();
                if (addresses && addresses.length > 0) {
                    registerWalletAndSyncAddress(manager, publicKey, addresses, (error, result) => {
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
        } else {
            if (typeof callback === 'function') {
                callback(new Error("Inputted PIN is not correct"), null);
            }
        }
    }
}