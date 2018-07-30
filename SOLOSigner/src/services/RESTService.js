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
    PUT: "PUT"
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
                body: isPost ? body : null,
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

module.exports.syncAddress = function(walletId, address) {
    try {
        sendRequest(URL_SYNC_ADDRESS, {
            address : { 
                address: address.address,
                coin: address.coin,
                network: address.network,
                accountIndex: address.accountIndex,
                chainIndex: address.chainIndex,
                addressIndex: address.addressIndex,
            },
            walletId : walletId
        }, HTTP_METHOD.POST);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Upload all addresses to server.
 * @param {Array} addresses
 */
module.exports.syncAllAddress = function(walletId, addresses) {
    try {
        sendRequest(URL_SYNC_ADDRESS, {
            addresses : addresses,
            walletId : walletId
        }, HTTP_METHOD.POST);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Update all addresses with properties to server.
 * @param {Array} addresses
 */
module.exports.updateAddresses = function(walletId, addresses) {
    try {
        sendRequest(URL_SYNC_ADDRESS, {
            addresses : addresses,
            walletId : walletId
        }, HTTP_METHOD.PUT);
    } catch (error) {
        console.log(error);
    }
}