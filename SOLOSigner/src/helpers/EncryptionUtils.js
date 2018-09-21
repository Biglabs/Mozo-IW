// let CryptoJS = require('crypto-js');

import RESTService from '../services/RESTService';

var RNCryptor = require('electron').remote.require('jscryptor');

module.exports.encrypt = function (data, password) {
  let encrypted_data = RNCryptor.Encrypt(data, password);
  return encrypted_data.toString();
}

module.exports.decrypt = function (data, password) {
  try {
    let decrypted_data = RNCryptor.Decrypt(data, password);
    return decrypted_data.toString();
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Hash input pin
 * @param {String} inputPIN
 */
// TODO: this function also exist in GlobalService
module.exports.convertToHash = function (inputPIN){
    let pinString = null;
    if(typeof(responseData) === 'string'){
        pinString = inputPIN;
    } else {
        pinString = JSON.stringify(inputPIN);
    }
    let sha512 = require('js-sha512');
    return sha512(pinString);
}
