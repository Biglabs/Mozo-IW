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

const TokenSchema = {
    name: 'Token',
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
}
export default DataService;

