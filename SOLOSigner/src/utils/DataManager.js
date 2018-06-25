import Realm from "realm";

const AppSchema = {
    name: 'App',
    primaryKey: 'pin',
    properties: {
        pin: 'string',
    },
}

const UserSchema = {
    name: 'User',
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
        address: 'string',
        derivedIndex: 'int',
        prvKey: 'string'
    },
};
const configuration = {schema: [UserSchema, AddressSchema, AppSchema], path : "solo.signer"};

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

    updatePin(pin){
        let appInfo = this.getAppInfo();
        let hashPin = this.convertToHash(pin);
        if(appInfo){
            //Remove old PIN
            DataManager.realm.write(() => {
                DataManager.realm.delete(appInfo);
            });
        } 
        //Add new
        this.addPin(hashPin);
        return hashPin;
    }

    addPin(hashPin){
        DataManager.realm.write(() => {
            DataManager.realm.create('App', { pin : hashPin });
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
                    console.error(error);
                    reject(error);
                });
            } catch (error) {
                console.error(error);
                // Rejection already happened with setTimeout
                if(didTimeOut) return;
                reject(error);
            }
        });
    }

    getAllAddressesFromServer(walletId){
        return new Promise((resolve, reject) => {
            try {
                this.sendRequest('http://192.168.1.91:8080/api/', {
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
                console.error(error);
                reject(error);
            }
        });
    }

    getExistingWalletFromServer(publicKey){
        return new Promise((resolve, reject) => {
            try {
                let hash = this.convertToHash(publicKey);
                this.sendRequest(`http://192.168.1.91:9000/api/wallets/${publicKey}`, {
                    walletKey: hash,
                }, false)
                .then((userInfo) => {
                    console.log(userInfo);
                    resolve(userInfo);
                })
                .catch((error) => {
                    console.log(error);
                    let existing = false;
                    if(error.status !== 'undefined') { 
                        if(error.status == 404){
                            existing = true;
                        }
                    }
                    reject({ error: error, existing : existing } );
                }); 
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    registerWallet(publicKey) {
        return new Promise((resolve, reject) => {
            try {
                let hash = this.convertToHash(publicKey);
                this.sendRequest('http://192.168.1.91:9000/api/wallets', {
                    walletKey: hash,
                }, true)
                .then((userInfo) => {
                    console.log(userInfo);
                    resolve(userInfo);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                }); 
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    syncAddress(address, walletId, derivedIndex, coinType, network) {
        try {
            this.sendRequest('http://192.168.1.91:9000/api/wallet-addresses', {
                address : { 
                    address: address,
                    derivedIndex : derivedIndex,
                    coin: coinType,
                    network: network
                },
                wallet : {
                    walletId : walletId
                }
            }, true);
        } catch (error) {
            console.error(error);
        }
    }

    saveUserInfo(userInfo) {
        DataManager.realm.write(() => {
            DataManager.realm.create('User', userInfo);
        });
    }

    getUserInfo() {
        let users = DataManager.realm.objects('User');
        if(users.length > 0) {
            return users[0];
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