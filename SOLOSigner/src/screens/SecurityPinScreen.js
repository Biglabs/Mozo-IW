import React, {Component} from "react";
import {AsyncStorage, TouchableHighlight, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {FooterActions, RotationView, Text} from "../components/SoloComponent";
import SvgUri from 'react-native-svg-uri';
import Constant from '../common/Constants';
import DataManager from '../utils/DataManager';
import Bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'bip39';
import TimerMixin from 'react-timer-mixin';

const accentColor = '#00fffc';
const numbersPressedColor = '#003c8d';
const numberPad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['CLR', 0, 'DEL']
];
const PIN_LENGTH = 4;
const inputNewPIN = "Create a new PIN";
const inputExistingPIN = "Enter PIN";

export default class SecurityPinScreen extends Component {
    constructor(props) {
        super(props);
        this.pinCode = Array.apply(null, Array(PIN_LENGTH));
        this.state = {pinIndex: -1, isShowingLoading: false, title: inputExistingPIN};
        if (this.props.isNewPIN) {
            this.state.title = inputNewPIN;
        }
    }

    componentDidUpdate(_, prevState) {
        if (prevState.isShowingLoading === false && this.state.isShowingLoading === true) {
            this.manageWallet().then(result => {
                if(result) {
                    this.props.isNewPIN = false;
                    // Open Home Screen
                    Actions.main_stack();
                } else {
                    this.clearPin();
                }
            });
        }
    }

    createNewWallet() {
        let mnemonic = this.props.importedPhrase || "test pizza drift whip rebel empower flame mother service grace sweet kangaroo";
        let seed = bip39.mnemonicToSeedHex(mnemonic);
        let rootKey = Bitcoin.HDNode.fromSeedHex(seed);
        return rootKey.derivePath("m/44'/60'/0'/0");
    }

    getAddressAtIndex(wallet, index) {
        try {
            let userWallet = wallet.derive(index);
            var keyPair = userWallet.keyPair;
            var privKeyBuffer = keyPair.d.toBuffer(32);
            var privkey = privKeyBuffer.toString('hex');
            var ethUtil = require('ethereumjs-util');
            var addressBuffer = ethUtil.privateToAddress(privKeyBuffer);
            var hexAddress = addressBuffer.toString('hex');
            var checksumAddress = ethUtil.toChecksumAddress(hexAddress);
            var address = ethUtil.addHexPrefix(checksumAddress);
            console.log("Ethereum address: [" + address + "]");
            privkey = ethUtil.addHexPrefix(privkey);
            return {address: address, derivedIndex: index, privkey: privkey};
        } catch (error) {
            console.error(error);
        }
        return null;
    }

    saveAddressToLocal(manager, walletData, hashPin) {
        // Because this is the first time when app is launched, data must be save to local
        // Save address and private key
        // Encrypt private key before saving to DB, password: hashPin
        let encryption = require('../common/encryption');
        let encryptedPrivateKey = encryption.encrypt(walletData.privkey, hashPin);
        manager.addAddress(walletData.address, walletData.derivedIndex, encryptedPrivateKey);
        // TODO: Load all addresses of this wallet from server and save to local
    }

    registerWalletAndSyncAddress(manager, publicKey, address, derivedIndex) {
        console.log("Check wallet");
        manager.getExistingWalletFromServer(publicKey).then(walletInfo => {
            console.log('Wallet is registered.');
            // Save Wallet Info - WalletId
            manager.saveWalletInfo(walletInfo);
            AsyncStorage.removeItem(Constant.FLAG_PUBLIC_KEY);
        }).catch((error) => {
            // Offline mode: Can not check wallet
            // Store public key for the next registration
            AsyncStorage.setItem(Constant.FLAG_PUBLIC_KEY, publicKey);
            if (error.isTimeOut !== 'undefined' && error.isTimeOut) {
                console.log('Check fail, timeout', error);
            } else {
                console.log('Register wallet');
                // Register wallet and save uid
                manager.registerWallet(publicKey).then((walletInfo) => {
                    console.log('Wallet is registered.');
                    // Save Wallet Info - WalletId
                    manager.saveWalletInfo(walletInfo);
                    AsyncStorage.removeItem(Constant.FLAG_PUBLIC_KEY);
                    // Synchronize address to server
                    manager.syncAddress(address, walletInfo.walletId, derivedIndex, "ETH", "ETH_TEST");
                    //TODO: Should retry incase network error
                    AsyncStorage.removeItem(Constant.FLAG_PUBLIC_KEY);
                }).catch((error) => {
                    console.log('Register fail', error);
                });
            }
        });
    }

    async manageWallet() {
        let manager = DataManager.getInstance();
        // Store isDbExisting true
        AsyncStorage.setItem(Constant.FLAG_DB_EXISTING, 'true');
        if (this.props.isNewPIN) {
            //If this is the first launch, AsyncStorage will store isDbExisting true
            // Save PIN
            let hashPin = manager.updatePin(this.pinCode);
            // TODO: Set timer here for the next time user have to re-enter PIN
            let ethWallet = this.createNewWallet();
            let publicKey = ethWallet.neutered().toBase58();
            let walletData = this.getAddressAtIndex(ethWallet, 0);
            this.saveAddressToLocal(manager, walletData, hashPin);

            // Check wallet is registered on server or not
            this.registerWalletAndSyncAddress(manager, publicKey, walletData.address, walletData.derivedIndex);
        } else {
            //Compare PIN
            let isEqual = manager.checkPin(this.pinCode);
            if (isEqual) {
                // Check wallet is registered on server or not
                AsyncStorage.getItem(Constant.FLAG_PUBLIC_KEY, (error, result) => {
                    if (!error && result) {
                        let publicKey = result;
                        let addresses = manager.getAllAddresses();
                        if (addresses && addresses.length > 0) {
                            let address = addresses[0];
                            this.registerWalletAndSyncAddress(manager, publicKey, address.address, address.derivedIndex);
                        }
                    }
                });
            } else {
                return false;
            }
        }
        return true;
    }

    clearPin() {
        this.setState({pinIndex: -1, isShowingLoading: false}, () => {
            this.pinCode = Array.apply(null, Array(PIN_LENGTH));
        });
    }

    keyPress(key) {
        if (key === 'DEL') {
            if (this.state.pinIndex === -1) return;

            this.pinCode[this.state.pinIndex] = null;
            this.setState({pinIndex: --this.state.pinIndex});
            return;

        } else if (key === 'CLR') {
            this.clearPin();
            return;
        }

        if (this.state.pinIndex >= (this.pinCode.length - 1)) return;

        this.setState({pinIndex: ++this.state.pinIndex}, () => {
            this.pinCode[this.state.pinIndex] = key;
        });
    }

    render() {
        if (this.state.isShowingLoading)
            return (
                <View style={styles.loading_container}>
                    <RotationView duration={1000}>
                        <SvgUri width={50} height={50} source={require('../res/icons/ic_loading_indicator.svg')}/>
                    </RotationView>

                    <Text style={styles.loading_text}>Creating Interface</Text>
                </View>
            );
        else
            return (
                <View style={styles.container}>

                    <Text style={[StyleSheet.value('$screen_title_text'), styles.title]}>Security Pin</Text>

                    <Text style={styles.sub_title}>{this.state.title}</Text>

                    <View style={styles.radio_container}>
                        {
                            this.pinCode.map((value, index) => {
                                return <View key={index} style={styles.radios}>
                                    {
                                        this.state.pinIndex >= index && <View style={styles.radios_checked}/>
                                    }
                                </View>
                            })
                        }
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
                        onBackPress={this.props.isNewPIN ? () => Actions.pop() : null}
                        enabledContinue={this.state.pinIndex === (this.pinCode.length - 1)}
                        onContinuePress={() => this.setState({isShowingLoading: true})}/>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    loading_container: {
        backgroundColor: '$primaryColor',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading_text: {
        fontSize: 14,
        color: '#ffffff',
        marginTop: 24
    },
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