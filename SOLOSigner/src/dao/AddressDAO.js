import { isWebPlatform } from "../helpers/PlatformUtils";
import service from '../services/DataService';

DataService = service.getInstance().constructor;
/** 
 * Load services base on running platform
*/
/* (function initServices() {
    if(isWebPlatform()){
        DataService = require('../services/DataService.web');
    }
    console.log("Service: " + JSON.stringify(DataService));
}()); */

/**
 * Get all addresses
 */
export function getAllAddresses(){
    let addresses = DataService.localStorage.objects('Address');
    return addresses;
}

/**
 * Get all in use addresses
 */
export function getAllAddressesInUse(){
    let addresses = getAllAddresses().filtered("inUse = true");
    return addresses;
}

/**
 * Update all addresses to set property inUse by network.
 * Then return all addresses which are not in use.
 * @param {Array} networks
 */
export function activeAddressesByNetworks(networks){
    let service = DataService;
    let addresses = getAllAddresses();
    service.localStorage.write(() => {
        for(var i = 0; i < addresses.length; i++) {
            let address = addresses[i];
            if (networks.indexOf(address.network) > -1){
                address.inUse = true;
            } else {
                address.inUse = false;
            }
        }
    });
}

/**
 * Save an address to local DB with the encrypted private key.
 * @param {Address} address
 * @param {String} pin
 */
export function saveAddressToLocal(address, pin) {
    // Because this is the first time when app is launched, data must be save to local
    // Save address and private key
    // Encrypt private key before saving to DB, password: pin
    let encryption = require('../helpers/EncryptionUtils');
    let encryptedPrivateKey = encryption.encrypt(address.privkey, pin);
    address.privkey = encryptedPrivateKey;
    addAddress(address);
}

/**
 * Add an address with properties to DB
 * @param {String} address
 */
function addAddress(address) {
    let service = DataService;
    service.localStorage.write(() => {
        let primaryKey = address.address + "_" + address.network;
        // Fix issue: Local data is not cleared totally.
        let adrObj = service.localStorage.objectForPrimaryKey('Address', primaryKey);
        if (!adrObj) {
            service.localStorage.create('Address', 
            { 
                address_network : primaryKey,
                address : address.address, 
                network: address.network,
                inUse: address.inUse, 
                prvKey: address.privkey,
                coin: address.coin,
                accountIndex: address.accountIndex,
                chainIndex: address.chainIndex,
                addressIndex: address.addressIndex,
            });
        }
    });
}

/**
 * Return private key of an address in string format.
 */
export function getPrivateKeyFromAddress(address) {
    let service = DataService;
    let addresses = service.localStorage.objects('Address');
    for(var i = 0; i < address.length; i++) {
        let item = addresses[i];
        if (item.address.toUpperCase() == address.toUpperCase()) {
            return item.prvKey;
        }
    }
    return null;
}
