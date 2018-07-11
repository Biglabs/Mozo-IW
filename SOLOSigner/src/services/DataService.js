import Realm from "realm";
import Globals from "./GlobalService";

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

class DataService {
    static myInstance = null;

    static realm = null;

    /**
     * @returns {DataService}
     */
    static getInstance() {
        if (DataService.myInstance == null) {
            DataService.myInstance = new DataService();
            DataService.realm = new Realm(configuration);
        }

        return DataService.myInstance;
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
            DataService.realm.write(() => {
                DataService.realm.delete(appInfo);
            });
        } 
        //Add new
        this.addMnemonicWithPin(mnemonic, hashPin);
        return hashPin;
    }

    addMnemonicWithPin(mnemonic, hashPin){
        DataService.realm.write(() => {
            DataService.realm.create('App', { pin : hashPin, mnemonic : mnemonic });
        });
    }
    
    saveWalletInfo(walletInfo) {
        return new Promise((resolve, reject) => {
            try {
                DataService.realm.write(() => {
                    DataService.realm.create('Wallet', walletInfo);
                    resolve(true);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getWalletInfo() {
        let wallets = DataService.realm.objects('Wallet');
        if(wallets.length > 0) {
            return wallets[0];
        }
        return null;
    }

    getAllAddresses(){
        let addresses = DataService.realm.objects('Address');
        return addresses;
    }

    addAddress(coinType, address, network, derivedIndex, prvKey) {
        DataService.realm.write(() => {
            DataService.realm.create('Address', { coinType : coinType, address : address, network: network, derivedIndex : derivedIndex, prvKey : prvKey });
        });
    }

    getPrivateKeyFromAddress(address, caseInsensitive) {
        if(!caseInsensitive) {
            let adrObj = DataService.realm.objectForPrimaryKey('Address', address);
            if(adrObj && adrObj.prvKey) {
                return adrObj.prvKey;
            }
        } else {
            let addresses = DataService.realm.objects('Address');
            for(var i = 0; i < address.length; i++) {
                let item = addresses[i];
                if (item.address.toUpperCase() == address.toUpperCase()) {
                    return item.prvKey;
                }
            }
        }
        return null;
    }

    getAppInfo() {
        let apps = DataService.realm.objects('App');
        if(apps.length > 0) {
            return apps[0];
        }
        return null;
    }
}
export default DataService;