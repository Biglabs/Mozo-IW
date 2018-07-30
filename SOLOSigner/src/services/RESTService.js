import Globals from "./GlobalService";

const BASE_URL = "http://192.168.1.98:9000";
const API_PATH = "/api";
const URL_GET_ALL_ADDRESSES = BASE_URL + API_PATH + "/wallet-addresses";
const URL_GET_WALLET = BASE_URL + API_PATH + "/wallets/";
const URL_REGISTER_WALLET = BASE_URL + API_PATH + "/wallets";
const URL_SYNC_ADDRESS = BASE_URL + API_PATH + "/wallet-addresses";
const URL_BTC_CREATE_TRANSACTION = BASE_URL + API_PATH + "/btc/test/txs";
const URL_ETH_CREATE_TRANSACTION = BASE_URL + API_PATH + "/eth/test/txs";
const URL_BTC_TX_REF = 'http://api.blockcypher.com/v1/btc/test3/addrs/';

const HTTP_METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
};

function sendRequest(url, params, method){
    const FETCH_TIMEOUT = 30000;
    return new Promise((resolve, reject) => {
        try {
            let body = JSON.stringify(params);
            console.log(body);
            let didTimeOut = false;
            const timeout = setTimeout(function() {
                didTimeOut = true;
                reject({isTimeOut : true});
            }, FETCH_TIMEOUT);
            
            fetch(url, {
                method: method,
                body: method != HTTP_METHOD.GET ? body : null,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => { 
                // Clear the timeout as cleanup
                clearTimeout(timeout);
                if(!didTimeOut) {
                    console.log('fetch good! ', response);
                }
                if(!response.ok){
                    console.log(response);
                    reject(response);
                } else {
                    response.json().then(json => {
                        console.log(json);
                        if(json){
                            resolve(json);
                        } else {
                            reject(new Error("No data"));
                        }
                    });
                }
            })
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
        } catch (error) {
            console.log(error);
            // Rejection already happened with setTimeout
            if(didTimeOut) return;
            reject(error);
        }
    });
}

module.exports.getAllAddressesFromServer = function(walletId){
    return new Promise((resolve, reject) => {
        try {
            sendRequest(URL_GET_ALL_ADDRESSES, {
                walletId: walletId,
            }, HTTP_METHOD.GET)
            .then((data) => {
                console.log(data);
                resolve(data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            }); 
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

module.exports.getExistingWalletFromServer = function(publicKey, callback){
    try {
        let hash = Globals.convertToHash(publicKey);
        sendRequest(URL_GET_WALLET + `${hash}`, HTTP_METHOD.GET)
        .then((walletInfo) => {
            console.log(walletInfo);
            if (typeof callback === 'function') {
                callback(null, walletInfo);
            }
        })
        .catch((error) => {
            console.log(error);
            if (typeof callback === 'function') {
                callback(error, null);
            }
        }); 
    } catch (error) {
        console.log(error);
        if (typeof callback === 'function') {
            callback(error, null);
        }
    }
}

module.exports.registerWallet = function(publicKey) {
    return new Promise((resolve, reject) => {
        try {
            let hash = Globals.convertToHash(publicKey);
            sendRequest(URL_REGISTER_WALLET, {
                walletKey: hash,
            }, HTTP_METHOD.POST)
            .then((walletInfo) => {
                console.log(walletInfo);
                resolve(walletInfo);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            }); 
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

/**
 * Upload all current local addresses including all their properties (except private key) 
 * @param {Array} addresses
 * @param {String} walletId
 */
module.exports.uploadAllAddresses = function(addresses, walletId){
    
    try {
        var walletAddressUpdateVM = [];
        addresses.map((address) => {
            var item = { address: address, walletId: walletId, inUse: address.inUse};
            walletAddressUpdateVM.push(item);
        });
        console.log("Update addresses to server.");
        sendRequest(URL_SYNC_ADDRESS, walletAddressUpdateVM, HTTP_METHOD.POST);
    } catch (error) {
        console.log(error);
    }
}