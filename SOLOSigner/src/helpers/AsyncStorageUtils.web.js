const userReference = require('electron').remote.require('electron-settings');
/**
 * Fetches an item for a key and invokes a callback upon completion. Returns a Promise object.
 * @param {String} key Key of the item to set.
 * @param {String} value Value to set for the key.
 * @param {Function} callback Function that will be called with any error.
 */
module.exports.setItem = function(key, value, callback){
    let result  = 'true';
    let error;

    try {
        userReference.set(key, value);
        console.log("setItem: " + userReference.get(key) );
    } catch (err) {
        error = err;
        result = 'false';
    }

    if (typeof callback === 'function') {
        return callback(error, result);
    }
    return null;
    
}   
/**
 * Sets the value for a key and invokes a callback upon completion. Returns a Promise object.
 * @param {String} key Key of the item to fetch.
 * @param {Function} callback Function that will be called with a result if found or any error. 
 */
module.exports.getItem = function(key, callback){
    let result = null;
    let error;
    
    try {
        result= userReference.get(key)  || null;
    } catch (err) {
        error  = err;
    }

    if (typeof callback === 'function') {
        return callback(error, result);
    }
}
/**
 * Removes an item for a key and invokes a callback upon completion. Returns a Promise object.
 * @param {String} key Key of the item to remove.
 * @param {Void} callback Function that will be called with any error.
 */
module.exports.removeItem = function(key, callback){
    let result  = 'true';
    let error;
    
    try {
        userReference.delete(key);
    } catch (err) {
        error = err;
        result = 'false';
    }

    if (typeof callback === 'function') {
        return callback(error, result);
    }
    return null;
}