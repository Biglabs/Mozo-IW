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
                })
                .then((responseJson) => {
                    console.log(responseJson);
                    resolve(responseJson);
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
        try {
            this.sendRequest('http://192.168.1.16/', {
                key: publicKey,
            })
            .then((userInfo) => {
                this.saveUserInfo(userInfo);
            }); 
        } catch (error) {
            console.error(error);
        }
    }

    syncAddress(uuid, address) {
        try {
            this.sendRequest('http://192.168.1.16/', {
                uuid: uuid,
                address: address
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