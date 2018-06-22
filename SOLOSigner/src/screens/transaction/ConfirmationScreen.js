import React, {Component} from "react";
import {Alert, Linking, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button, NavigationBar, Text} from "../../components/SoloComponent";

import bip39 from 'bip39';
import Transaction from 'ethereumjs-tx';
import Web3 from 'web3';
import Bitcoin from "react-native-bitcoinjs-lib";
import DataManager from '../../utils/DataManager';

export default class ConfirmationScreen extends Component {

    constructor(props) {
        super(props);

        this.ethProvider = new Web3(
            new Web3.providers.HttpProvider('https://ropsten.infura.io/Onb2hCxHKDYIL0LNn8Ir')
        ).eth;
    }

    componentDidMount() {
        //For the first time component render
        // Alert.alert(
        //     "Alert",
        //     this.props.txData,
        //     [
        //       {text: 'OK', onPress: () => console.log('OK Pressed')},
        //     ],
        //   );
    }


    showAlert(message) {
        Alert.alert(
            "Alert",
            message,
            [
                {text: 'OK'},
            ],
        );
    }

    //ONLY: For testing purpose
    generatePrivateKey() {
        let mnemonic = "test pizza drift whip rebel empower flame mother service grace sweet kangaroo";
        let seed = bip39.mnemonicToSeedHex(mnemonic);
        let rootKey = Bitcoin.HDNode.fromSeedHex(seed);
        let bip32ExtendedKey = rootKey.derivePath("m/44'/60'/0'/0").derive(0);
        this.privateKeyInBuffer = bip32ExtendedKey.keyPair.d.toBuffer(32);
    }

    onConfirmTransaction() {
        let manager = DataManager.getInstance();
        let encryptedPrivateKey = manager.getPrivateKeyFromAddress(this.props.txData.params.from);
        if(!encryptedPrivateKey){
            alert('Not support this address');
            return;
        }
        let app = manager.getAppInfo();
        if(!app || !app.pin){
            alert('System error');
            return;
        }
        let hashPin = app.pin;
        // Encrypt private key before saving to DB, password: hashPin
        let encryption = require('../../components/encryption/encryption');
        let privateKey = encryption.decrypt(encryptedPrivateKey, hashPin);
        //TODO: Convert privateKey in string format to buffer
        var ethUtil = require('ethereumjs-util');
        this.privateKeyInBuffer = ethUtil.toBuffer(privateKey);
        if (!this.privateKeyInBuffer) {
            this.generatePrivateKey();
        }
        this.ethProvider.getTransactionCount(this.props.txData.params.from).then(_nonce => {
            const etherAmount = this.props.txData.params.value;
            const txParams = {
                nonce: _nonce,
                gasLimit: 3000000,
                gasPrice: Web3.utils.toHex(Web3.utils.toWei('21', 'gwei')),
                from: this.props.txData.params.from,
                to: this.props.txData.params.to,
                value: Web3.utils.toHex(Web3.utils.toWei(etherAmount, 'ether')),
                data: Web3.utils.fromUtf8('send ' + etherAmount + 'ETH from account 1 to account 2\nmessage: ' + this.props.txData.params.txData + "\nfrom: " + this.props.txData.receiver),
                // EIP 155 chainId - mainnet: 1, ropsten: 3
                chainId: 3
            };
            const tx = new Transaction(txParams);
            tx.sign(this.privateKeyInBuffer);
            const serializedTx = tx.serialize();
            //Verify connection is successful
            let data = `0x${serializedTx.toString('hex')}`;
            this.ethProvider.sendSignedTransaction(data)
                .on('receipt', receipt => {
                    console.log("receipt: " + receipt.toString());
                    this.responseToReceiver(receipt);
                })
                .on('error', (e) => {
                    this.showAlert("Sending Error: " + e);
                });
        });
    }

    responseToReceiver(receipt) {
        const url = `${this.props.txData.receiver}://${JSON.stringify(receipt)}`;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                this.showAlert('Can\'t handle url: ' + url);
            } else {
                Actions.main_stack();
                return Linking.openURL(url);
            }
        }).catch(err => this.showAlert('An error occurred ' + err));
    }

    render() {
        return (
            <View style={styles.container}>

                <NavigationBar title='Send Confirmation'/>


                <Text style={StyleSheet.value('$screen_title_text')}>SEND CONFIRMATION</Text>
                <Text>From: {this.props.txData.params.from}</Text>
                <Text>To: {this.props.txData.params.to}</Text>
                <Text>value: {this.props.txData.params.value}</Text>
                <Text>message: {this.props.txData.params.txData}</Text>
                <Text>receiver: {this.props.txData.receiver}</Text>

                <Button title='Confirm Transaction'
                        onPress={() => this.onConfirmTransaction()}/>

                <Button title='Back'
                        style={StyleSheet.value('$back_button')}
                        fontSize={16}
                        icon={require('../../res/icons/ic_arrow_left.svg')}
                        onPress={() => Actions.pop()}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 30,
        paddingRight: 30
    },
});