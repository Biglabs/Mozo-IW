import Constant from '../common/Constants';
import DataManager from '../utils/DataManager';
import Bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'bip39';
import encryption from '../common/encryption';
import {AsyncStorage} from 'react-native';
import RESTService from '../utils/RESTService';
import ethUtil from 'ethereumjs-util';
import Web3 from 'web3';
import Transaction from 'ethereumjs-tx';
import Bitcoin from 'react-native-bitcoinjs-lib';

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
        let wallet = _rootKey.derivePath(`m/44'/${coinType.value}'/0'/0`);
        wallets.push(wallet);
    });
    // let wallet = rootKey.derivePath("m/44'/60'/0'/0");
    return wallets;
}

getAddressAtIndex = function(wallet, coinType, index) {
    try {
        let userWallet = wallet.derive(index);
        var keyPair = userWallet.keyPair;
        var privKeyBuffer = keyPair.d.toBuffer(32);
        var privkey = privKeyBuffer.toString('hex');
        var addressBuffer = ethUtil.privateToAddress(privKeyBuffer);
        var hexAddress = addressBuffer.toString('hex');
        var checksumAddress = ethUtil.toChecksumAddress(hexAddress);
        var address = (coinType == Constant.COIN_TYPE.ETH.value ? ethUtil.addHexPrefix(checksumAddress) : checksumAddress);
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
    manager.addAddress(coinType.name, walletData.address, coinType.network, walletData.derivedIndex, encryptedPrivateKey);
    // TODO: Load all addresses of this wallet from server and save to local
}

registerWalletAndSyncAddress = function(manager, publicKey, walletDataArray, callback) {
    console.log("Check wallet");
    RESTService.getExistingWalletFromServer(publicKey).then(walletInfo => {
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
            RESTService.registerWallet(publicKey).then((walletInfo) => {
                console.log('Wallet is registered.');
                // Save Wallet Info - WalletId
                manager.saveWalletInfo(walletInfo).then(result => {
                    walletDataArray.map((item) => {
                        // Synchronize all addresses to server
                        RESTService.syncAddress(walletInfo.walletId, item.address, item.derivedIndex, item.coinType, item.network);
                    });
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

createNewBTCTransaction = function(txData, callback){
    let params = JSON.stringify(txData.params);
    RESTService.createNewBTCTransaction(params)
    .then(result => {
        if (typeof callback === 'function') {
            callback(null, result);
        }
    })
    .catch(error => {
        if (typeof callback === 'function') {
            callback(error, null);
        }
    });
}

signBTCTransaction = function(privateKey, totalAmount, amountToKeep, txData, callback){
    createNewBTCTransaction(txData, (error, result) => {
        if(result){
            const TestNet = Bitcoin.networks.testnet;
            let wallet = new Bitcoin.ECPair.fromWIF(privateKey, TestNet);
            let publicKey = wallet.getAddress();
            console.log("Wallet's public key:", publicKey);

            let tx = new Bitcoin.TransactionBuilder(TestNet);

            let amountWeHave = totalAmount; // 1.0 BTC
            let transactionFee = 1000; // 0.0001 BTC
            let amountToSend = amountWeHave - amountToKeep - transactionFee; // ~0.1 (0.0999)

            result.tx.inputs.map(input => {
                let prevTxHash = Buffer.from(input.prev_hash, 'hex');
                tx.addInput(prevTxHash, input.output_value, input.sequence, input.script);
            });
            //tx.addInput('<one of my input transactions>', 0);

            result.tx.outputs.map(output => {
                tx.addOutput(output, amountToSend);
            });
            //tx.addOutput('<destination public key>', amountToSend);
            tx.addOutput(publicKey, amountToKeep);
            tx.sign(0, wallet);

            let tx_hex = tx.build().toHex();
        } else {
            if (typeof callback === 'function') {
                callback(error, null);
            }
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
            coinTypes = Constant.DEFAULT_COINS;
        }
        let wallets = createNewWallet(manager, importedPhrase, pin, coinTypes);
        let walletDataArray = [];
        wallets.map((wallet, index) => {
            let coinType = coinTypes[index];
            let walletData = getAddressAtIndex(wallet, coinType.value, 0);
            saveAddressToLocal(manager, coinType, walletData, pin);
            walletDataArray.push({coinType : coinType.name, address : walletData.address, network: coinType.network, derivedIndex : walletData.derivedIndex, prvKey : null });
        });
        let publicKey = wallets[0].neutered().toBase58();
        registerWalletAndSyncAddress(manager, publicKey, walletDataArray, (error, result) => {
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

module.exports.signTransaction = function(txData, pin, callback){
    let manager = DataManager.getInstance();
    let fromAddress = txData.params.from;
    let encryptedPrivateKey = manager.getPrivateKeyFromAddress(fromAddress);
    if (!encryptedPrivateKey) {
        if (typeof callback === 'function') {
            callback(new Error("Not support this address."), null);
        }
        return;
    }
    if (!pin) {
        if (typeof callback === 'function') {
            callback(new Error("Can not use the PIN."), null);
        }
        return;
    }
    // Encrypt private key before saving to DB, password: pin
    let privateKey = encryption.decrypt(encryptedPrivateKey, pin);
    let privateKeyInBuffer = ethUtil.toBuffer(privateKey);
    if(privateKeyInBuffer){
        const web3 = new Web3(
            new Web3.providers.HttpProvider('https://ropsten.infura.io/Onb2hCxHKDYIL0LNn8Ir')
        );
        web3.eth.getTransactionCount(fromAddress).then(_nonce => {
            const etherAmount = txData.params.value !== 'string' ? txData.params.value.toString() : txData.params.value;
            const txParams = {
                nonce: _nonce,
                gasLimit: 3000000,
                gasPrice: web3.utils.toHex(web3.utils.toWei('21', 'gwei')),
                from: fromAddress,
                to: txData.params.to,
                value: web3.utils.toHex(web3.utils.toWei(etherAmount, 'ether')),
                data: web3.utils.fromUtf8(txData.params.data || ''),
                // EIP 155 chainId - mainnet: 1, ropsten: 3
                chainId: 3
            };
            const tx = new Transaction(txParams);
            tx.sign(privateKeyInBuffer);
            const serializedTx = tx.serialize();
            let signedTransaction = `0x${serializedTx.toString('hex')}`;
            if (typeof callback === 'function') {
                callback(null, signedTransaction);
            }
        });
    } else {
        if (typeof callback === 'function') {
            callback(new Error("Not support this address's private key."), null);
        }
    }
}

module.exports.backupWallet = function(pin, callback) {

}

module.exports.addNewAddress = function(pin, coinType, index, callback) {
    let manager = DataManager.getInstance();
    let appInfo = manager.getAppInfo();
    if (appInfo) {
        let encryptedMnemonic = appInfo.mnemonic;
        let mnemonic = encryption.decrypt(encryptedMnemonic, pin);
        let seed = bip39.mnemonicToSeedHex(mnemonic);
        let rootKey = Bitcoin.HDNode.fromSeedHex(seed);
        let wallet = rootKey.derivePath(`m/44'/${coinType.value}'/0'/0`);
        let walletData = getAddressAtIndex(wallet, coinType.value, index);
        saveAddressToLocal(manager, coinType, walletData, pin);
        let walletInfo = manager.getWalletInfo();
        if(walletInfo){
            walletInfo = { walletId : walletInfo.walletId };
            RESTService.syncAddress(walletInfo.walletId, walletData.address, walletData.derivedIndex, coinType.name, coinType.network);
        }
        if (typeof callback === 'function') {
            callback(null, walletData.address);
        }
    } else {
        if (typeof callback === 'function') {
            callback(new Error("Inputted PIN is not correct"), null);
        }
    }
}