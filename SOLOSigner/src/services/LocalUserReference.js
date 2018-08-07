const userReference = require('electron').remote.require('electron-settings');

export default class LocalUserReference {
    
    /**
     * Return all items by schema name
     *
     * @param {String} schemaName
     */
    objects(schemaName) {
        return userReference.get(schemaName);
    }

    /**
     * Create a block code to call a function inside.
     *
     * @param {Function} callFunction
     */
    write(callFunction) {
        callFunction();
    }

    /**
     * Insert new item into a list which is stored in user reference.
     *
     * @param {String} schemaName
     * @param {Object} object
     */
    create(schemaName, object) {
        //get list of address
        let addressList = userReference.get(schemaName) || [];
        addressList.push(object);
        //write to file
        userReference.set(schemaName, addressList);
    }

    /**
     * get item base on schema name and key
     * @param {String} schemaName 
     * @param {String} key
     * @returns {*} return address object or null
     */
    objectForPrimaryKey(schemaName, key){
        let addressList = userReference.get(schemaName);
        console.log(JSON.stringify(addressList));
        let rs;
        if(addressList) {
            rs = addressList.filter(item => item['address_network'] === key);
        }
        if(rs && rs.length == 1){
            return rs[0];
        }
        return null;
        
    }
}