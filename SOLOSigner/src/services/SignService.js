import Web3 from 'web3';
import {addressDAO} from '../dao';
import Constant from '../helpers/Constants';
import Bitcoin from 'react-native-bitcoinjs-lib';
import ethUtil from 'ethereumjs-util';

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
serialize = function(v, r, s) {
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
canonicalizeInt = function(buffer) {
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

/**
 * Return private keys related to input address.
 * @param {String} pin
 * @param {Array} inputs
 * @param {CoinType} coinType
 */
getAllPrivateKeys = function(pin, inputs, coinType){
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
        let encryptedPrivateKey = addressDAO.getPrivateKeyFromAddress(address);
        if (!encryptedPrivateKey) {
            return null;
        }
        let encryption = require('../helpers/EncryptionUtils');
        let privateKey = encryption.decrypt(encryptedPrivateKey, pin);
        privKeys.push(privateKey);
    }
    return privKeys;
}

/**
 * Sign a transaction with format inputs, outputs, toSign, publicKeys and signatures.
 * @param {JSON} txData
 * @param {String} pin
 * @param {function} callback
 */
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
