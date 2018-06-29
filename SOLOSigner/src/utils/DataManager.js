import Realm from "realm";

const AppSchema = {
    name: 'App',
    primaryKey: 'pin',
    properties: {
        pin: 'string',
        mnemonic: 'string'
    },
}

const WalletSchema = {
    name: 'Wallet',
    primaryKey: 'id',
    properties: {
        id: 'int',
        walletKey : 'string',
        walletId : 'string',
        name: 'string?'
    },
};

const AddressSchema = {
    name: 'Address',
    primaryKey: 'address',
    properties: {
        coinType: 'int',
        address: 'string',
        derivedIndex: 'int',
        prvKey: 'string'
    },
};
const configuration = {schema: [WalletSchema, AddressSchema, AppSchema], path : "solo.signer"};

class DataManager {
    static myInstance = null;

    static realm = null;

    /**
     * @returns {DataManager}
     */
    static getInstance() {
        if (DataManager.myInstance == null) {
            DataManager.myInstance = new DataManager();
            DataManager.realm = new Realm(configuration);
        }

        return DataManager.myInstance;
    }

    convertToHash(inputPIN){
        let pinString = null;
        if(typeof(responseData) === 'string'){
            pinString = inputPIN;
        } else {
            pinString = JSON.stringify(inputPIN);
        }
        var sha512 = require('js-sha512');
        let hashPin = sha512(pinString);
        return hashPin;
    }

    checkPin(expectedPin){
        let appInfo = this.getAppInfo();
        if(appInfo && appInfo.pin) {
            let actualHashPin = appInfo.pin;
            let expectedHashPin = this.convertToHash(expectedPin);
            if(expectedHashPin == actualHashPin){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    updateMnemonicWithPin(mnemonic, pin){
        let appInfo = this.getAppInfo();
        let hashPin = this.convertToHash(pin);
        if(appInfo){
            //Remove old PIN
            DataManager.realm.write(() => {
                DataManager.realm.delete(appInfo);
            });
        } 
        //Add new
        this.addMnemonicWithPin(mnemonic, hashPin);
        return hashPin;
    }

    addMnemonicWithPin(mnemonic, hashPin){
        DataManager.realm.write(() => {
            DataManager.realm.create('App', { pin : hashPin, mnemonic : mnemonic });
        });
    }

    sendRequest(url, params, isPost){
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

    getAllAddressesFromServer(walletId){
        return new Promise((resolve, reject) => {
            try {
                this.sendRequest('http://192.168.1.98:9000/api/', {
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

    getExistingWalletFromServer(publicKey){
        return new Promise((resolve, reject) => {
            try {
                let hash = this.convertToHash(publicKey);
                this.sendRequest(`http://192.168.1.98:9000/api/wallets/${hash}`, false)
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

    registerWallet(publicKey) {
        return new Promise((resolve, reject) => {
            try {
                let hash = this.convertToHash(publicKey);
                this.sendRequest('http://192.168.1.98:9000/api/wallets', {
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

    syncAddress(address, walletId, derivedIndex, coinType, network) {
        try {
            this.sendRequest('http://192.168.1.98:9000/api/wallet-addresses', {
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

    saveWalletInfo(walletInfo) {
        return new Promise((resolve, reject) => {
            try {
                DataManager.realm.write(() => {
                    DataManager.realm.create('Wallet', walletInfo);
                    resolve(true);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getWalletInfo() {
        let wallets = DataManager.realm.objects('Wallet');
        if(wallets.length > 0) {
            return wallets[0];
        }
        return null;
    }

    getAllAddresses(){
        let addresses = DataManager.realm.objects('Address');
        return addresses;
    }

    addAddress(address, derivedIndex, prvKey) {
        DataManager.realm.write(() => {
            DataManager.realm.create('Address', { address : address, derivedIndex : derivedIndex, prvKey : prvKey });
        });
    }

    getPrivateKeyFromAddress(address) {
        let adrObj = DataManager.realm.objectForPrimaryKey('Address', address);
        if(adrObj && adrObj.prvKey) {
            return adrObj.prvKey;
        }
        return null;
    }

    getAppInfo() {
        let apps = DataManager.realm.objects('App');
        if(apps.length > 0) {
            return apps[0];
        }
        return null;
    }
}
export default DataManager;