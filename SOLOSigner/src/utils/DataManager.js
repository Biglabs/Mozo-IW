import Realm from "realm";
import Globals from "../common/Globals";

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
        coinType: 'string',
        address: 'string',
        network: 'string',
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
            let expectedHashPin = Globals.convertToHash(expectedPin);
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
        let hashPin = Globals.convertToHash(pin);
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

    addAddress(coinType, address, network, derivedIndex, prvKey) {
        DataManager.realm.write(() => {
            DataManager.realm.create('Address', { coinType : coinType, address : address, network: network, derivedIndex : derivedIndex, prvKey : prvKey });
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