let CryptoJS = require('crypto-js');

module.exports.encrypt = function (data, password) {
    return CryptoJS.AES.encrypt(data, password).toString();
};

module.exports.decrypt = function (data, password) {
    try {
        let bytes = CryptoJS.AES.decrypt(data, password);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
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
