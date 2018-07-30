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
    primaryKey: 'address_network',
    properties: {
        address_network: 'string',
        address: 'string',
        network: 'string',
        inUse: 'bool',
        prvKey: 'string',
        coin: 'string',
        accountIndex: 'int',
        chainIndex: 'int',
        addressIndex: 'int',
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
                let wallet = this.getWalletInfo();
                DataService.realm.write(() => {
                    // Fix issue: Local data is not cleared totally.
                    if (wallet) {
                        DataService.realm.delete(wallet);
                    }
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

    /**
     * Update all addresses to set property inUse by network.
     * Then return all addresses which are not in use.
     * @param {Array} networks
     */
    activeAddressesByNetworks(networks){
        let addresses = this.getAllAddresses();
        DataService.realm.write(() => {
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

    addAddress(address) {
        DataService.realm.write(() => {
            let primaryKey = address.address + "_" + address.network;
            // Fix issue: Local data is not cleared totally.
            let adrObj = DataService.realm.objectForPrimaryKey('Address', primaryKey);
            if (!adrObj) {
                DataService.realm.create('Address', 
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

    getPrivateKeyFromAddress(address) {
        let addresses = DataService.realm.objects('Address');
        for(var i = 0; i < address.length; i++) {
            let item = addresses[i];
            if (item.address.toUpperCase() == address.toUpperCase()) {
                return item.prvKey;
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