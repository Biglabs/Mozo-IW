import {AsyncStorage} from "react-native";
import {Actions} from "react-native-router-flux";
import {FLAG_DB_EXISTING} from './Constants';

function checkWalletExisting() {
    AsyncStorage.getItem(FLAG_DB_EXISTING, (error, result) => {
        if (result === 'true') {
            /* has wallet */
            Actions.security_pin({isNewPin: false});
        } else {
            /* no wallet, create a new one */
            Actions.reset('welcome');
        }
    });
}

function responseToReceiver(result, jsonData) {
    let responseData = {
        action: jsonData.action,
        result: result,
    };
    const responseUrl = `${this.props.txData.receiver}://${JSON.stringify(responseData)}`;
    Linking.openURL(responseUrl).then().catch(error => 
        console.log(error)
    );
}

module.exports = {
    checkWalletExisting: checkWalletExisting,
    responseToReceiver: responseToReceiver
};