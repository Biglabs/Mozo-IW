import WebConstants from "../helpers/WebConstants";

const userReference = require('electron').remote.require('electron-settings');

/**
 * add address to wallet
 *
 * @param {*} address
 */
function addAddress(address) {
    if(!userReference.has(WebConstants.ADDRESS_SCHEMA)) {
        userReference.set(WebConstants.ADDRESS_SCHEMA, []);
    }
    //get list of address
    let addressList = userReference.get(WebConstants.ADDRESS_SCHEMA);
    let primaryKey = address.address + "_" + address.network;
    //add address
    addressList.push({
        address_network : primaryKey,
        address : address.address, 
        network: address.network, 
        prvKey: address.privkey,
        coin: address.coin,
        accountIndex: address.accountIndex,
        chainIndex: address.chainIndex,
        addressIndex: address.addressIndex,
    });
    //write to file
    userReference.set(WebConstants.ADDRESS_SCHEMA, addressList);
}

/**
 * get all address from wallet
 *
 * @returns {Array} ArrayOfAddress
 */
function getAllAddresses(){
    let addresses = userReference.get(WebConstants.ADDRESS_SCHEMA);
    return addresses;
} 

/**
 * expose to outside
 */
module.exports = {
    getAllAddresses:getAllAddresses,
    addAddress: addAddress,
};
