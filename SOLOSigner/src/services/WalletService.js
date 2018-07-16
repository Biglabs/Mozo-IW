import Constant from '../helpers/Constants';
import DataService from './DataService';
import Bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'bip39';
import encryption from '../helpers/EncryptionUtils';
import {AsyncStorage} from 'react-native';
import RESTService, { syncAllAddress } from './RESTService';
import ethUtil from 'ethereumjs-util';
import Web3 from 'web3';

createNewWallet = function(manager, importedPhrase, pin, coinTypes) {
    let mnemonic = importedPhrase || 
        bip39.generateMnemonic(128, null, bip39.wordlists.english);
    // Save PIN and mnemonic
    let encryptedMnemonic = encryption.encrypt(mnemonic, pin);
    manager.updateMnemonicWithPin(encryptedMnemonic, pin);
    let wallets = generateWallets(mnemonic, coinTypes);
    return wallets;
}

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
            //TODO: Support SOLO and MOZO
        }
        console.log("Address: [" + address + "]");
        return {address: address, addressIndex: addressIndex, privkey: privkey};
    } catch (error) {
        console.error(error);
    }
    return null;
}

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

storeWalletInfo = function(manager, walletInfo, addresses, callback){
    console.log("Store wallet info to local.")
    try {
        AsyncStorage.removeItem(Constant.FLAG_PUBLIC_KEY);
        manager.saveWalletInfo(walletInfo).then(result => {
            if (typeof callback === 'function') {
                callback(null, true);
            }
            console.log("Sync all local addresses to server.");
            RESTService.syncAllAddress(walletInfo.walletId, addresses);
        });
    } catch (error) {
        console.log("Store wallet info error: " + error);
        if (typeof callback === 'function') {
            callback(error, null);
        }
    }
}

// syncAllAddress = function(walletId, addresses) {
//     // TODO: Get all addresses from server

//     // TODO: Compare with local addresses

//     // TODO: Resolve conflict (if any)

//     // Sync final addresses to server
//     RESTService.syncAllAddress(walletId, addresses);
// }

module.exports.manageWallet = function(isNewPin, pin, importedPhrase, coinTypes, callback) {
    let manager = DataService.getInstance();
    // Store isDbExisting true
    AsyncStorage.setItem(Constant.FLAG_DB_EXISTING, 'true');
    if (isNewPin) {
        // TODO: Set timer here for the next time when user have to re-enter PIN
        let isDefault = coinTypes ? false : true;
        if (isDefault) {
            coinTypes = Constant.DEFAULT_COINS;
        }
        let wallets = createNewWallet(manager, importedPhrase, pin, coinTypes);
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
        let publicKey = wallets[0].neutered().toBase58();
        registerWalletAndSyncAddress(manager, publicKey, addresses, (error, result) => {
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

module.exports.viewBackupPhrase = function (pin) {
    let appInfo = DataService.getInstance().getAppInfo();
    if (appInfo) {
        return encryption.decrypt(appInfo.mnemonic, pin);
    }
    return null;
};

// Serialize returns the ECDSA signature in the more strict DER format.  Note
// that the serialized bytes returned do not include the appended hash type
// used in Bitcoin signature scripts.
//
// encoding/asn1 is broken so we hand roll this output:
//
// 0x30 <length> 0x02 <length r> r 0x02 <length s> s
serialize = function (v, r, s) {
    let rB = canonicalizeInt(r);
    let sB = canonicalizeInt(s);
    let prefix = "30" + (rB.length + sB.length + 4).toString(16);
    let rStr = "02" + rB.length.toString(16) + rB.toString('hex');
    let sStr = "02" + sB.length.toString(16) + sB.toString('hex');
    return prefix.concat(rStr, sStr).toString('hex');
}

// canonicalizeInt returns the bytes for the passed big integer adjusted as
// necessary to ensure that a big-endian encoded integer can't possibly be
// misinterpreted as a negative number.  This can happen when the most
// significant bit is set, so it is padded by a leading zero byte in this case.
// Also, the returned bytes will have at least a single byte when the passed
// value is 0.  This is required for DER encoding.
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
        if(Web3.utils.isHex(privateKey)){ //ETH
            let buffer = ethUtil.toBuffer(privateKey);
            let tosignBuffer = new Buffer(tosign, 'hex');
            let msgSign = ethUtil.ecsign(tosignBuffer, buffer);
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