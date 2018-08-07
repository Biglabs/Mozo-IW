const userReference = require('electron').remote.require('electron-settings');
/**
 * Fetches an item for a key and invokes a callback upon completion. Returns a Promise object.
 * @param {String} key Key of the item to set.
 * @param {String} value Value to set for the key.
 * @param {Void} callback Function that will be called with any error.
 */
module.exports.setItem = function(key, value, callback){
    userReference.set(key, value);
    if (typeof callback === 'function') {
        return callback;
    }
    return null;
}   
/**
 * Sets the value for a key and invokes a callback upon completion. Returns a Promise object.
 * @param {String} key Key of the item to fetch.
 * @param {Void} callback Function that will be called with a result if found or any error. 
 */
module.exports.getItem = function(key, callback){
    userReference.get(key);
    if (typeof callback === 'function') {
        return callback;
    } 
}
/**
 * Removes an item for a key and invokes a callback upon completion. Returns a Promise object.
 * @param {String} key Key of the item to remove.
 * @param {Void} callback Function that will be called with any error.
 */
module.exports.removeItem = function(key, callback){
    userReference.delete(key);
    if (typeof callback === 'function') {
        return callback;
    }
    return null;
}