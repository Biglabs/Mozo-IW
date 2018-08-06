import Constant from '../helpers/Constants';
import {addressDAO, appDAO, walletDAO} from '../dao';
import Bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'bip39';
import encryption from '../helpers/EncryptionUtils';
import {AsyncStorage} from 'react-native';
import RESTService from './RESTService';
import ethUtil from 'ethereumjs-util';

/**
 * Return a list of keypair (wallet) following a list of coin type.
 * A mnemonic string will be used in this process and stored to local db in encryption for backup purpose.
 * @param {String} importedPhrase
 * @param {String} pin
 * @param {Array} coinTypes
 * @return {Array}
 */
createNewWallet = function(importedPhrase, pin, coinTypes, mustSave) {
    let mnemonic = importedPhrase || 
        bip39.generateMnemonic(128, null, bip39.wordlists.english);
    if (mustSave) {
        // Save PIN and mnemonic
        let encryptedMnemonic = encryption.encrypt(mnemonic, pin);
        appDAO.updateMnemonicWithPin(encryptedMnemonic, pin);
    }
    let wallets = generateWallets(mnemonic, coinTypes);
    return wallets;
}

/**
 * Generate a list of keypair (wallet) according to each derivation path.
 * @param {String} mnemonic
 * @param {Array} coinTypes
 * @return {Array} array of {KeyPair}
 */
generateWallets = function(mnemonic, coinTypes){
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
 * Returns the standard derivation path in bip44 format.
 * The output of this function can be use to create a key pair.
 * @param {String} _coinType
 * @param {Int} _accountIndex
 * @param {_chain} _chain
 * @returns {String}
 */
standardDerivationPath = function(_coinType, _accountIndex, _chain) {
    // Default is 0
    let accountIndex = _accountIndex || 0;
    // Default is external
    let chain = _chain || 0;
    return `m/44'/${_coinType}'/${accountIndex}'/${chain}`;
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
            //TODO: Support SOLO
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
 * @param {String} publicKey
 * @param {Array} addresses
 * @param {Callback} callback
 */
registerWalletAndSyncAddress = function(publicKey, addresses, callback) {
    console.log("Check wallet");
    RESTService.getExistingWalletFromServer(publicKey, (error, result) => {
        if(result){
            console.log('Wallet is registered before.');
            storeWalletInfo(result, addresses, (error, result) => {
                if (typeof callback === 'function') {
                    callback(error, result);
                }
            });
        } else {
            // Offline mode: Can not check wallet
            // Store public key for the next registration
            AsyncStorage.setItem(Constant.FLAG_PUBLIC_KEY, publicKey);
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
                    storeWalletInfo(walletInfo, addresses, (error, result) => {
                        console.log("Callback after storing wallet and upload addresses.");
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
 * @param {String} publicKey
 * @param {Array} addresses
 * @param {Callback} callback
 */
storeWalletInfo = function(walletInfo, addresses, callback){
    console.log("Store wallet info to local.")
    try {
        AsyncStorage.removeItem(Constant.FLAG_PUBLIC_KEY);
        walletDAO.saveWalletInfo(walletInfo).then(result => {
            if (typeof callback === 'function') {
                callback(null, true);
            }
            console.log("Sync all local addresses to server.");
            RESTService.uploadAllAddresses(addresses, walletInfo.walletId, (error, result) => {
                if (result) {
                    console.log("Upload addresses successfully, result: " + result); 
                } else {
                    console.log("Upload addresses failed, error: " + error);
                }
            });
        });
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
    // Store isDbExisting true
    // TODO: @apply desktop: save flag Constant.FLAG_DB_EXISTING
    AsyncStorage.setItem(Constant.FLAG_DB_EXISTING, 'true');
    if (isNewPin) {
        let isDefault = coinTypes ? false : true;
        if (isDefault) {
            coinTypes = Constant.DEFAULT_COINS;
        }
        let standardTypes = getStandardCoinTypes();
        let wallets = createNewWallet(importedPhrase, pin, standardTypes, true);
        let addresses = createAddressList(wallets, pin, coinTypes);
        let publicKey = wallets[0].neutered().toBase58();
        registerWalletAndSyncAddress(publicKey, addresses, (error, result) => {
            console.log("Callback after registering wallet.");
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
        let isEqual = appDAO.checkPin(pin);
        if (isEqual) {
            // Check wallet is registered on server or not
            AsyncStorage.getItem(Constant.FLAG_PUBLIC_KEY, (error, result) => {
                if (!error && result) {
                    let publicKey = result;
                    let addresses = addressDAO.getAllAddresses();
                    if (addresses && addresses.length > 0) {
                        registerWalletAndSyncAddress(publicKey, addresses, (error, result) => {
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

/**
 * Create all addresses of each wallet. Addresses will be updated to local.
 * @param {String} pin
 * @param {Array} coinTypes
 */
createAddressList = function(wallets, pin, coinTypes){
    let standardTypes = getStandardCoinTypes();
    var choosenNetworks = [];
    coinTypes.map(coinType => {
        choosenNetworks.push(coinType.network);
    });
    let addresses = [];
    wallets.map((wallet, index) => {
        let coinType = standardTypes[index];
        let address = generateAddressAtIndex(wallet, coinType.value, 0);
        address.accountIndex = 0;
        address.chainIndex = 0;
        address.coin = coinType.name;
        address.network = coinType.network;
        address.inUse = true;
        if (choosenNetworks.indexOf(coinType.network) == -1){
            address.inUse = false;
        }
        console.log(`Address in use: ` + address.inUse);
        addressDAO.saveAddressToLocal(address, pin);
        address.privkey = null;
        addresses.push(address);
    });
    return addresses;
}

/**
 * Return standard coin type list by converting constant COIN_TYPE
 */
getStandardCoinTypes = function(){
    var standardCoinTypes = [];
    for(var property in Constant.COIN_TYPE){
        var item = Constant.COIN_TYPE[property];
        if (item.name != "SOLO") {
            standardCoinTypes.push(item);
        }
    }
    return standardCoinTypes;
}

/**
 * Load all addresses which are in use and convert to a list of coin types and networks. 
 * @param {String} pin
 * @param {Array} coinTypes
 */
module.exports.loadInUseCoinTypes = function(){
    let addresses = addressDAO.getAllAddressesInUse();
    var coinTypes = [];
    addresses.map(address => {
        for(var property in Constant.COIN_TYPE){
            var item = Constant.COIN_TYPE[property];
            if (address.coin == item.name && address.network == item.network){
                coinTypes.push(item);
                return;        
            }
        }
    });
    return coinTypes;
}

/**
 * Update all addresses with new coin type list then update them at local and server. 
 * @param {String} pin
 * @param {Array} coinTypes
 */
module.exports.updateAddresses = function(coinTypes) {
    var networks = [];
    coinTypes.map((coinType) => {
        networks.push(coinType.network);
    });
    addressDAO.activeAddressesByNetworks(networks);
    let addresses = addressDAO.getAllAddresses();
    var updateAddresses = [];
    addresses.map((address) => {
        var updateAddress = {};
        for(var k in address) {
            updateAddress[k]=address[k];
        }
        updateAddress.prvKey = null;
        updateAddresses.push(updateAddress);
    });
    let walletInfo = walletDAO.getWalletInfo();
    if(walletInfo){
        let walletId = walletInfo.walletId;
        RESTService.uploadAllAddresses(updateAddresses, walletId);
    }
}

/**
 * Return current mnemonic string for UI display.
 * @param {Any} pin 
 */
module.exports.viewBackupPhrase = function (pin) {
    return appDAO.getRawMnemonic(pin);
};