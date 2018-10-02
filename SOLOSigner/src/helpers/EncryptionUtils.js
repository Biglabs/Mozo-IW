// let CryptoJS = require('crypto-js');

var sjcl = require('./sjcl');
var RNCryptor = require('./rncryptor');

module.exports.encrypt = function (data, password) {
  let convert_pass_text = JSON.parse(password).join("");
  let encrypted_data = RNCryptor.Encrypt(
    convert_pass_text,
    sjcl.codec.utf8String.toBits(data));
  return encrypted_data;
}

module.exports.decrypt = function (data, password) {
  let convert_pass_text = JSON.parse(password).join("");
  try {
    let decrypted_data = RNCryptor.Decrypt(
      convert_pass_text,
      sjcl.codec.base64.toBits(data));
    return decrypted_data;
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
