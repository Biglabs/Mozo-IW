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
