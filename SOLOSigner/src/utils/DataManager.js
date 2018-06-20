const UserSchema = {
    name: 'User',
    primaryKey: 'uuid',
    properties: {
        uuid: 'string',
        name: 'string'
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
class DataManager {
    static myInstance = null;

    static realm = null;

    /**
     * @returns {DataManager}
     */
    static getInstance() {
        if (DataManager.myInstance == null) {
            DataManager.myInstance = new DataManager();
            DataManager.realm = new Realm({schema: [UserSchema, AddressSchema]});
        }

        return DataManager.myInstance;
    }

    registerWallet(publicKey) {
        try {
            fetch('http://192.168.1.16/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: publicKey,
            }),
            })
            .then((response) => { 
                saveUserInfo(response); 
            })
            .then((responseJson) => {
                saveUserInfo(responseJson);
            })
            .catch((error) => {
            console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    }

    saveUserInfo(userInfo) {
        DataManager.realm.write(() => {
            DataManager.realm.create('User', { uuid : userInfo.uuid, name : userInfo.name});
        });
    }

    getUserInfo() {
        let user = DataManager.realm.objects('User')[0];
        return user;
    }

    addAddress(address, prvKey) {
        DataManager.realm.write(() => {
            DataManager.realm.create('Address', { address : address, prvKey : prvKey});
        });
    }

    getPrivateKeyFromAddress(address) {
        let adrObj = DataManager.realm.objectForPrimaryKey('Address', address);
        if(adrObj && adrObj.prvKey) {
            return adrObj.prvKey;
        }
        return null;
    }
}
//DataManager.realm = new Realm({schema: [UserSchema, AddressSchema]});
export default DataManager;