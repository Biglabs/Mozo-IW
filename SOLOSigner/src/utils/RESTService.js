import Globals from "../common/Globals";

const BASE_URL = "http://192.168.1.98:9000";
const API_PATH = "/api";
const URL_GET_ALL_ADDRESSES = BASE_URL + API_PATH + "/wallet-addresses";
const URL_GET_WALLET = BASE_URL + API_PATH + "/wallets/";
const URL_REGISTER_WALLET = BASE_URL + API_PATH + "/wallets";
const URL_SYNC_ADDRESS = BASE_URL + API_PATH + "/wallet-addresses";
const URL_BTC_CREATE_TRANSACTION = BASE_URL + API_PATH + "/btc/test/txs";
const URL_ETH_CREATE_TRANSACTION = BASE_URL + API_PATH + "/eth/test/txs";
const URL_BTC_TX_REF = 'http://api.blockcypher.com/v1/btc/test3/addrs/';

function sendRequest(url, params, isPost){
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
            
            let method = isPost ? 'POST' : 'GET';
            
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
            }, false)
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

module.exports.getExistingWalletFromServer = function(publicKey){
    return new Promise((resolve, reject) => {
        try {
            let hash = Globals.convertToHash(publicKey);
            sendRequest(URL_GET_WALLET + `${hash}`, false)
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

module.exports.registerWallet = function(publicKey) {
    return new Promise((resolve, reject) => {
        try {
            let hash = Globals.convertToHash(publicKey);
            sendRequest(URL_REGISTER_WALLET, {
                walletKey: hash,
            }, true)
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

module.exports.syncAddress = function(walletId, address, derivedIndex, coinType, network) {
    try {
        sendRequest(URL_SYNC_ADDRESS, {
            address : { 
                address: address,
                derivedIndex : derivedIndex,
                coin: coinType,
                network: network
            },
            walletId : walletId
        }, true);
    } catch (error) {
        console.log(error);
    }
}

module.exports.createNewBTCTransaction = function(data){
    return new Promise((resolve, reject) => {
        try {
            sendRequest(URL_BTC_CREATE_TRANSACTION, data, true)
            .then((txData) => {
                console.log(txData);
                resolve(txData);
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

module.exports.createNewETHTransaction = function(data){
    return new Promise((resolve, reject) => {
        try {
            sendRequest(URL_ETH_CREATE_TRANSACTION, data, true)
            .then((txData) => {
                console.log(txData);
                resolve(txData);
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

module.exports.getTransactionRefs = function(addresses){
    return new Promise((resolve, reject) => {
        try {
            let addrStr = addresses.join(';');
            sendRequest(URL_BTC_TX_REF + addrStr, null, false)
            .then((txData) => {
                console.log(txData);
                resolve(txData);
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