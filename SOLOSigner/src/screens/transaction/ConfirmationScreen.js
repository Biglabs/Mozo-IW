import React, {Component} from "react";
import {Alert, Linking, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
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
        this.state = {
            pressedConfirm: false
        };
        this.ethProvider = new Web3(
            new Web3.providers.HttpProvider('https://ropsten.infura.io/Onb2hCxHKDYIL0LNn8Ir')
        ).eth;
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
        if (!encryptedPrivateKey) {
            alert('Not support this address');
            return;
        }
        let app = manager.getAppInfo();
        if (!app || !app.pin) {
            alert('System error');
            return;
        }
        let hashPin = app.pin;
        // Encrypt private key before saving to DB, password: hashPin
        let encryption = require('../../common/encryption');
        let privateKey = encryption.decrypt(encryptedPrivateKey, hashPin);
        //TODO: Convert privateKey in string format to buffer
        var ethUtil = require('ethereumjs-util');
        this.privateKeyInBuffer = ethUtil.toBuffer(privateKey);
        if (!this.privateKeyInBuffer) {
            this.generatePrivateKey();
        }
        let txData = this.props.txData;
        this.ethProvider.getTransactionCount(this.props.txData.params.from).then(_nonce => {
            const etherAmount = txData.params.value !== 'string' ? txData.params.value.toString() : txData.params.value;
            const txParams = {
                nonce: _nonce,
                gasLimit: 3000000,
                gasPrice: Web3.utils.toHex(Web3.utils.toWei('21', 'gwei')),
                from: txData.params.from,
                to: txData.params.to,
                value: Web3.utils.toHex(Web3.utils.toWei(etherAmount, 'ether')),
                data: Web3.utils.fromUtf8('send ' + etherAmount + 'ETH from account 1 to account 2\nmessage: ' + txData.params.txData + "\nfrom: " + txData.receiver),
                // EIP 155 chainId - mainnet: 1, ropsten: 3
                chainId: 3
            };
            const tx = new Transaction(txParams);
            tx.sign(this.privateKeyInBuffer);
            let signedTransaction = `0x${tx.serialize().toString('hex')}`;
            this.responseToReceiver(signedTransaction);
        });
    }

    responseToReceiver(signedTransaction) {
        let responseData = {
            action: this.props.txData.action,
            result: signedTransaction,
        };
        const responseUrl = `${this.props.txData.receiver}://${JSON.stringify(responseData)}`;
        Actions.main_stack();
        Linking.openURL(responseUrl).then().catch(error =>
            alert(error)
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='Send Confirmation'
                    backgroundColor={StyleSheet.value('$primaryColor')}
                    accentColor='#ffffff'/>

                <View style={styles.content}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <SvgUri
                            fill={StyleSheet.value('$primaryColor')}
                            width={15}
                            height={15}
                            source={require('../../res/icons/ic_send.svg')}/>
                        <Text style={styles.text_send}>Send</Text>
                    </View>
                    <Text style={styles.text_value}>
                        {this.props.txData.params.value} {(this.props.txData.coinType || '').toUpperCase()}
                    </Text>
                    <Text style={styles.text_usd}>... USD</Text>

                    <View style={styles.dash}/>

                    <Text>
                        <Text style={styles.text_section}>Mining Fee: </Text>
                        <Text style={[styles.text_section, styles.text_mining_fee_value]}>... BTC</Text>
                    </Text>

                    <View style={styles.dash}/>

                    <Text style={styles.text_section}>To:</Text>
                    <Text style={styles.text_address} numberOfLines={1}
                          ellipsizeMode='middle'>{this.props.txData.params.to}</Text>

                    <View style={styles.dash}/>

                    <Text style={styles.text_section}>From:</Text>
                    <Text style={styles.text_address} numberOfLines={1}
                          ellipsizeMode='middle'>{this.props.txData.params.from}</Text>

                    <View style={styles.dash}/>

                    {
                        this.state.pressedConfirm &&
                        <View style={styles.confirmation_container}>

                            <Text style={styles.confirmation_text}>Hold 5s to confirm send transaction</Text>
                        </View>
                    }
                    <TouchableOpacity style={styles.button_confirm}
                                      onPressIn={() => this.setState({pressedConfirm: true})}
                                      onPressOut={() => {
                                          this.setState({pressedConfirm: false});
                                          this.onConfirmTransaction();
                                      }}>
                        <SvgUri
                            fill={StyleSheet.value('$primaryColor')}
                            width={33}
                            height={33}
                            source={require('../../res/icons/ic_check.svg')}/>
                        <Text style={styles.text_confirm}>Confirm</Text>
                    </TouchableOpacity>
                </View>
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
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '$screen_padding_horizontal'
    },
    dash: {
        height: 1,
        backgroundColor: '$disableColor',
        marginTop: 20,
        marginBottom: 15
    },
    text_send: {
        color: '$textContentColor',
        fontSize: 16,
        marginLeft: 12
    },
    text_value: {
        color: '$primaryColor',
        fontSize: 25
    },
    text_usd: {
        color: '#c1c1c1',
        fontSize: 14
    },
    text_section: {
        color: '$textTitleColor',
        fontSize: 14,
        fontFamily: '$primaryFontBold'
    },
    text_mining_fee_value: {
        fontFamily: '$primaryFont'
    },
    text_address: {
        color: '#969696',
        fontSize: 12
    },
    text_confirm: {
        color: '$textTitleColor',
        fontSize: 16,
        fontFamily: '$primaryFontBold',
        marginLeft: 6,
    },
    button_confirm: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: '36%',
        right: '36%',
        marginBottom: 20,
    },
    confirmation_container: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    confirmation_text: {
        color: '#5a9cf5',
        fontSize: 12
    }
});