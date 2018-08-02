/**
 * Hash an object to a text by using sha512
 * @param {Object} objectToHash
 */
export function convertToHash(objectToHash){
    let message = null;
    if(typeof(objectToHash) === 'string'){
        message = objectToHash;
    } else {
        message = JSON.stringify(objectToHash);
    }
    var sha512 = require('js-sha512');
    let hashedMessage = sha512(message);
    return hashedMessage;
}