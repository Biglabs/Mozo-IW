/**
 * Return all items by schema name
 *
 * @param {String} schemaName
 */
Object.prototype.objects = function(schemaName) {
    let userReference = require('electron').remote.require('electron-settings');
    return userReference.get(schemaName);
}

/**
 * Create a block code to call a function inside.
 *
 * @param {Function} callFunction
 */
Object.prototype.write = function(callFunction) {
    callFunction();
}

/**
 * Insert new item into a list which is stored in user reference.
 *
 * @param {String} schemaName
 * @param {Object} object
 */
Object.prototype.create = function(schemaName, object) {
    let userReference = require('electron').remote.require('electron-settings');
    //get list of address
    let addressList = userReference.get(WebConstants.ADDRESS_SCHEMA);
    addressList.push(object);
    //write to file
    userReference.set(schemaName, object);
}

/**
 * Filter or query to get a list of items through some conditions.
 *
 * @param {String} query
 */
Array.prototype.filtered = function(query) {
    // TODO: Implement query for a list of items
    return [];
}

Object.prototype.objectForPrimaryKey = function(schemaName, key){
    // TODO: Implement for web
    return {};
}

