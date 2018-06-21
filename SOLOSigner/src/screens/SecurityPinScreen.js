import React, {Component} from "react";
import {TouchableHighlight, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {FooterActions, Text} from "../components/SoloComponent";
import DataManager from '../utils/DataManager';
import Bitcoin from 'react-native-bitcoinjs-lib';

const accentColor = '#00fffc';
const numbersPressedColor = '#003c8d';
const numberPad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['CLR', 0, 'DEL']
];

const inputNewPIN = "Create a new PIN";
const inputExistingPIN = "Enter PIN";

export default class ImportWalletScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.pinCode = [null, 2, null, null];
        this.state = {pinIndex: -1};
        this.state.title = inputExistingPIN;
        if(this.props.isNewPIN){
            this.state.title = inputNewPIN;
        }
    }

    createNewWallet(){
        let mnemonic = "test pizza drift whip rebel empower flame mother service grace sweet kangaroo";
        let seed = bip39.mnemonicToSeedHex(mnemonic);
        let rootKey = Bitcoin.HDNode.fromSeedHex(seed);
        var bip32ExtendedKey = rootKey.derivePath("m/44'/60'/0'/0");
        
        return bip32ExtendedKey;
    }

    getAddressAtIndex(wallet, index){
        try {
            let userWallet = wallet.derive(index);
            var keyPair = userWallet.keyPair;
            this.state.privKeyBuffer = keyPair.d.toBuffer(32);
            var privkey = this.state.privKeyBuffer.toString('hex');
            var ethUtil = require('ethereumjs-util');
            var addressBuffer = ethUtil.privateToAddress(this.state.privKeyBuffer);
            var hexAddress = addressBuffer.toString('hex');
            var checksumAddress = ethUtil.toChecksumAddress(hexAddress);
            var address = ethUtil.addHexPrefix(checksumAddress);
            console.log("Ethereum address: [" + address + "]")
            privkey = ethUtil.addHexPrefix(privkey);
            return {address : address, privkey : privkey};
        } catch (error) {
            console.error(error);
        }
        return null;
    }

    continuePress(){
        //TODO: Should show spinning view here
        let manager = DataManager.getInstance();
        if(this.props.isNewPIN){
            //If this is the first launch, AsyncStorage will store isDbExisting true
            // Save PIN
            let hashPin = manager.updatePin(this.pinCode);
            let ethWallet = this.createNewWallet();
            let publicKey = ethWallet.neutered().toBase58();
            // Register wallet and save uid
            manager.registerWallet(publicKey).then((userInfo) => {
                alert('Register success');
                // Save User Info
                manager.saveUserInfo(userInfo);
                let walletData = this.getAddressAtIndex(ethWallet, 0);
                // Save address and private key
                //TODO: Use bip38 to encrypt private key before saving to DB, password: hashPin
                manager.addAddress(walletData.address, walletData.privkey);
                // Synchronize address to server
                manager.syncAddress(walletData.address, userInfo.soloWalletId);
            }).catch((error) => {
                alert('Register fail');
            });
            // Store isDbExisting true
            AsyncStorage.setItem('@DbExisting:key', true);
            this.props.isNewPIN = false;
        } else {
            // Set isDbExisting true
            AsyncStorage.setItem('@DbExisting:key', true);
            //Compare PIN
            let isEqual = manager.checkPin(this.pinCode);
            if(isEqual){
                // Open Home Screen
                Actions.main_stack();
            } else {
                this.clearPin();
            }
            
        }
    }

    clearPin() {
        this.setState({pinIndex: -1}, () => {
            this.pinCode = [null, null, null, null];
        });
    }

    keyPress(key) {
        if (key === 'CLR') {
            if (this.state.pinIndex === -1) return;

            this.pinCode[this.state.pinIndex] = null;
            this.setState({pinIndex: --this.state.pinIndex});
            return;

        } else if (key === 'DEL') {
            this.clearPin();
            return;
        }

        if (this.state.pinIndex >= 3) return;

        this.setState({pinIndex: ++this.state.pinIndex}, () => {
            this.pinCode[this.state.pinIndex] = key;
        });
    }

    render() {
        return (
            <View style={styles.container}>

                <Text style={[StyleSheet.value('$screen_title_text'), styles.title]}>Security Pin</Text>

                <Text style={styles.sub_title}>{this.state.title}</Text>

                <View style={styles.radio_container}>
                    <View style={styles.radios}>{
                        this.state.pinIndex >= 0 && <View style={styles.radios_checked}/>
                    }</View>
                    <View style={styles.radios}>{
                        this.state.pinIndex >= 1 && <View style={styles.radios_checked}/>
                    }</View>
                    <View style={styles.radios}>{
                        this.state.pinIndex >= 2 && <View style={styles.radios_checked}/>
                    }</View>
                    <View style={styles.radios}>{
                        this.state.pinIndex >= 3 && <View style={styles.radios_checked}/>
                    }</View>
                </View>

                <View style={styles.number_pad}>
                    {
                        numberPad.map((row, key) => {
                            return <View key={key} style={styles.numbers_row}>
                                {
                                    row.map(button => {
                                        return <TouchableHighlight
                                            key={button}
                                            style={styles.numbers_touch}
                                            onPress={() => this.keyPress(button)}
                                            underlayColor={numbersPressedColor}>

                                            <Text style={styles.numbers}>{button}</Text>

                                        </TouchableHighlight>
                                    })
                                }
                            </View>
                        })
                    }
                </View>

                <FooterActions
                    buttonsColor={{back: accentColor, continue: accentColor}}
                    onBackPress={() => Actions.pop()}
                    enabledContinue={this.state.pinIndex === 3}
                    onContinuePress={() =>  this.continuePress()}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: '$primaryColor',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 30,
        paddingRight: 30
    },
    title: {
        width: '100%',
        textAlign: 'center',
        color: '$screenBackground'
    },
    sub_title: {
        width: '100%',
        textAlign: 'center',
        color: '$screenBackground',
        fontSize: 14
    },
    radio_container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 12,
    },
    radios: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: accentColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
    },
    radios_checked: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: accentColor
    },
    number_pad: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '$screen_padding_bottom',
    },
    numbers_row: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 7,
        marginBottom: 7,
    },
    numbers_touch: {
        width: 66,
        height: 66,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    numbers: {
        color: '#429ffd',
        fontSize: 23.8,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
        paddingBottom: 2
    }
});