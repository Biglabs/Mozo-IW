import Constant from '../helpers/Constants';
import DataService from './DataService';
import Bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'bip39';
import encryption from '../helpers/EncryptionUtils';
import {AsyncStorage} from 'react-native';
import RESTService from './RESTService';
import ethUtil from 'ethereumjs-util';
import Web3 from 'web3';

/**
 * Return a list of keypair (wallet) following a list of coin type.
 * A mnemonic string will be used in this process and stored to local db in encryption for backup purpose.
 * @param {DataService} manager
 * @param {String} importedPhrase
 * @param {String} pin
 * @param {Array} coinTypes
 * @return {Array}
 */
createNewWallet = function(manager, importedPhrase, pin, coinTypes, mustSave) {
    let mnemonic = importedPhrase || 
        bip39.generateMnemonic(128, null, bip39.wordlists.english);
    if (mustSave) {
        // Save PIN and mnemonic
        let encryptedMnemonic = encryption.encrypt(mnemonic, pin);
        manager.updateMnemonicWithPin(encryptedMnemonic, pin);
    }
    let wallets = generateWallets(mnemonic, coinTypes);
    return wallets;
}

/**
 * Generate a list of keypair (wallet) according to each derivation path.
 * @param {String} mnemonic
 * @param {Array} coinTypes
 * @return {Array}
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
    manager.addAddress(address);
    // TODO: Load all addresses of this wallet from server and save to local
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
                    storeWalletInfo(manager, walletInfo, addresses, (error, result) => {
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
 * @param {DataService} manager
 * @param {String} publicKey
 * @param {Array} addresses
 * @param {Callback} callback
 */
storeWalletInfo = function(manager, walletInfo, addresses, callback){
    console.log("Store wallet info to local.")
    try {
        AsyncStorage.removeItem(Constant.FLAG_PUBLIC_KEY);
        manager.saveWalletInfo(walletInfo).then(result => {
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
    let manager = DataService.getInstance();
    // Store isDbExisting true
    AsyncStorage.setItem(Constant.FLAG_DB_EXISTING, 'true');
    if (isNewPin) {
        let isDefault = coinTypes ? false : true;
        if (isDefault) {
            coinTypes = Constant.DEFAULT_COINS;
        }
        let wallets = createNewWallet(manager, importedPhrase, pin, Constant.DEFAULT_COINS, true);
        let addresses = createAddressList(manager, wallets, pin, coinTypes);
        let publicKey = wallets[0].neutered().toBase58();
        registerWalletAndSyncAddress(manager, publicKey, addresses, (error, result) => {
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
        let isEqual = manager.checkPin(pin);
        if (isEqual) {
            // Check wallet is registered on server or not
            AsyncStorage.getItem(Constant.FLAG_PUBLIC_KEY, (error, result) => {
                if (!error && result) {
                    let publicKey = result;
                    let addresses = manager.getAllAddresses();
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
createAddressList = function(manager, wallets, pin, coinTypes){
    let defaultTypes = Constant.DEFAULT_COINS;
    var choosenNetworks = [];
    coinTypes.map(coinType => {
        choosenNetworks.push(coinType.network);
    });
    let addresses = [];
    wallets.map((wallet, index) => {
        let coinType = defaultTypes[index];
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
        saveAddressToLocal(manager, address, pin);
        address.privkey = null;
        addresses.push(address);
    });
    return addresses;
}

/**
 * Load all addresses which are in use and convert to a list of coin types and networks. 
 * @param {String} pin
 * @param {Array} coinTypes
 */
module.exports.loadInUseCoinTypes = function(){
    let manager = DataService.getInstance();
    let addresses = manager.getAllAddressesInUse();
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
    let manager = DataService.getInstance();
    var networks = [];
    coinTypes.map((coinType) => {
        networks.push(coinType.network);
    });
    manager.activeAddressesByNetworks(networks);
    let addresses = manager.getAllAddresses();
    var updateAddresses = [];
    addresses.map((address) => {
        var updateAddress = {};
        for(var k in address) {
            updateAddress[k]=address[k];
        }
        updateAddress.prvKey = null;
        updateAddresses.push(updateAddress);
    });
    let walletInfo = manager.getWalletInfo();
    if(walletInfo){
        let walletId = walletInfo.walletId;
        RESTService.uploadAllAddresses(updateAddresses, walletId);
    }
}

module.exports.viewBackupPhrase = function (pin) {
    let appInfo = DataService.getInstance().getAppInfo();
    if (appInfo) {
        return encryption.decrypt(appInfo.mnemonic, pin);
    }
    return null;
};

/**
 * Serialize returns the ECDSA signature in the more strict DER format.  Note
 * that the serialized bytes returned do not include the appended hash type
 * used in Bitcoin signature scripts.
 * 
 * encoding/asn1 is broken so we hand roll this output:
 * 0x30 <length> 0x02 <length r> r 0x02 <length s> s
 * @param {Array} v
 * @param {Array} r
 * @param {Array} s
 * @return {String}
 */
serialize = function (v, r, s) {
    let rB = canonicalizeInt(r);
    let sB = canonicalizeInt(s);
    let prefix = "30" + (rB.length + sB.length + 4).toString(16);
    let rStr = "02" + rB.length.toString(16) + rB.toString('hex');
    let sStr = "02" + sB.length.toString(16) + sB.toString('hex');
    return prefix.concat(rStr, sStr).toString('hex');
}

/**
 * canonicalizeInt returns the bytes for the passed big integer adjusted as
 * necessary to ensure that a big-endian encoded integer can't possibly be
 * misinterpreted as a negative number.  This can happen when the most
 * significant bit is set, so it is padded by a leading zero byte in this case.
 * Also, the returned bytes will have at least a single byte when the passed
 * value is 0.  This is required for DER encoding.
 * @param {Array} buffer
 * @return {Array}
 */
canonicalizeInt = function (buffer) {
	var bytes = buffer;
	if (bytes.length == 0) {
		bytes[0] = 0x00;
	}
	if ((bytes[0] & 0x80) != 0) {
        var paddedBytes = new Buffer(bytes.length + 1);
        paddedBytes[0] = 0x00;
        bytes.copy(paddedBytes, 1);
		bytes = paddedBytes;
	}
	return bytes;
}

/**
 * Returns the object including signature of `tosign` and public key from private key.
 * The output of this function can be use in `handleSignTransaction` to complete the transaction.
 * @param {String} tosign
 * @param {Buffer} privateKey
 * @param {String} net
 * @returns {Object}
 */
signTxMessage = function(tosign, privateKey, net){
    try {
        var sign = null;
        var publicKey = null;
        if (Web3.utils.isHex(privateKey)){ //ETH
            let buffer = ethUtil.toBuffer(privateKey);
            // Remove the prefix "0x" if any
            let tosignBuffer = new Buffer(tosign.replace("0x", ""), "hex");
            let msgSign = ethUtil.ecsign(tosignBuffer, buffer);
            publicKey = ethUtil.privateToPublic(buffer).toString('hex');
            console.log('Public key: ' + publicKey);
            sign = serialize(msgSign.v, msgSign.r, msgSign.s);
            console.log('Sign: ' + sign);
        } else { //BTC
            let keyPair = new Bitcoin.ECPair.fromWIF(privateKey, net);
            publicKey = keyPair.getPublicKeyBuffer().toString('hex');
            sign = keyPair.sign(new Buffer(tosign, 'hex')).toDER().toString('hex');
        }
        return { signature : sign, publicKey : publicKey };
    } catch (error) {
        console.log("Error signTxMessage: " + error);
    }
    return null;
}

getAllPrivateKeys = function(pin, inputs, coinType){
    let manager = DataService.getInstance();
    var privKeys = [];
    for(var i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        let address = input.addresses[0];
        // Because Signer store ETH address in hex format
        // Therefore, if inputs address formats are not in hex, they must be converted to hex.
        if (coinType == Constant.COIN_TYPE.ETH.name) {
            if(!address.startsWith("0x")){
                address = "0x" + address;
            }
        }
        let encryptedPrivateKey = manager.getPrivateKeyFromAddress(address);
        if (!encryptedPrivateKey) {
            return null;
        }
        let privateKey = encryption.decrypt(encryptedPrivateKey, pin);
        privKeys.push(privateKey);
    }
    return privKeys;
}

module.exports.signTransaction = function(txData, pin, callback){
    if (!pin) {
        if (typeof callback === 'function') {
            callback(new Error("Can not use the PIN."), null);
        }
        return;
    }
    var inputs = txData.params.tx.inputs;
    var privKeys = getAllPrivateKeys(pin, inputs, txData.coinType);
    if (!privKeys || privKeys.length == 0) {
        if (typeof callback === 'function') {
            callback(Constant.ERROR_TYPE.INVALID_ADDRESS, null);
        }
        return;
    }

    try {
        var validateTx = txData.params;
        var network = txData.network; 
        const net = (network == Constant.COIN_TYPE.BTC.network ? Bitcoin.networks.bitcoin : Bitcoin.networks.testnet);
        // signing each of the hex-encoded string required to finalize the transaction
        validateTx.pubkeys = [];
        validateTx.signatures = [];
        validateTx.tosign.map(function (tosign, index) {
            var privateKey = privKeys[index];
            var sign = signTxMessage(tosign, privateKey, net);
            console.log('Sign: ' + sign);
            validateTx.pubkeys.push(sign.publicKey);
            validateTx.signatures.push(sign.signature);
        });
        if (validateTx.signatures.length != validateTx.tosign.length) {
            if (typeof callback === 'function') {
                callback(Constant.ERROR_TYPE.INVALID_ADDRESS, null);
            }
            return;
        }
        let signedTransaction = JSON.stringify(validateTx);
        if (typeof callback === 'function') {
            callback(null, signedTransaction);
        }
    } catch (error) {
        if (typeof callback === 'function') {
            callback(error, null);
        }
    }
}