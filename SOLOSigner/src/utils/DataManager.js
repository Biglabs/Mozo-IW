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

    /*
    
    splash -> check path
        -> co -> pin screen -> check pin (thu open DB)
            -> dung -> open DB 
            -> sai -> nhap lai pin

        -> ko -> welcome ... -> pin -> open Db moi

    */

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
            if(expectedHashPin.equalTo(actualHashPin)){
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
                //Add new
                this.addPin(hashPin);
            });
        } else {
            //Add new
            this.addPin(hashPin);
        }
        return hashPin;
    }

    addPin(hashPin){
        DataManager.realm.write(() => {
            DataManager.realm.create('App', { pin : hashPin });
        });
    }

    sendRequest(url, params){
        return new Promise((resolve, reject) => {
            try {
                fetch(url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                })
                .then((response) => { 
                    console.log(response);
                    if(!response.ok){
                        reject(response);
                    }
                })
                .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson){
                        resolve(responseJson);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
            } catch (error) {
                console.error(error);
            }
        });
    }

    registerWallet(publicKey) {
        return new Promise((resolve, reject) => {
            try {
                let hash = this.convertToHash(publicKey);
                this.sendRequest('http://192.168.1.91:8080/api/solo-wallets', {
                    walletKey: hash,
                })
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

    syncAddress(address, walletId) {
        try {
            this.sendRequest('http://192.168.1.91:8080/api/wallet-addresses', {
                addressId: address,
                soloWalletId: walletId
            });
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

    addAddress(address, prvKey) {
        DataManager.realm.write(() => {
            DataManager.realm.create('Address', { address : address, prvKey : prvKey });
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