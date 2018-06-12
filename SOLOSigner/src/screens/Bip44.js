import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, Alert} from 'react-native';
import Bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'bip39';

type Props = {};
export default class Bip44 extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            rootKey: '',
            adrBip44Test: '',
            seed: this.props.seed
        };
    }



    render() {
        return (
            <View key="bip44" style={styles.container}>
                <Text>
                    Bip44
                </Text>
                <Button title='Generate BTC Wallet' onPress={() => {
                    let seed = this.state.seed;
                    // Generate BIP32 Root Key from BIP39 Seed
                    let rootKey = Bitcoin.HDNode.fromSeedHex(seed);
                    this.setState({
                        rootKey: "Root key: " + rootKey.toBase58()
                    });
                    // 2 levels of 0' here as per BIP44 spec
                    var childKey = rootKey.derivePath("m/44'/0'/0'/0/0");
                    this.setState({
                        adrBip44Test: childKey.getAddress()
                    });
                }}/>
                <Button title='Generate ETH Wallet' onPress={() => {
                    /*var hdkey = require('ethereumjs-wallet-react-native/hdkey');
                    let seed = this.state.seed;
                    let mnemonic = "punch bullet board enrich live pattern soul priority mail spy fix cotton letter inhale exile";
                    seed = bip39.mnemonicToSeedHex(mnemonic);
                    this.setState({
                        seedTest: "Seed: " + seed
                    });
                    var ethereumHDKey = hdkey.fromMasterSeed(seed);
                    ethereumHDKey = ethereumHDKey.derivePath("m/44'/60'/0'/0");
                    this.setState({
                        rootKey: "Bip32 Private extended key: " + ethereumHDKey.privateExtendedKey(),
                        xpub : "Bip32 Public extended key: " + ethereumHDKey.publicExtendedKey()
                    });
                    let wallet = ethereumHDKey.getWallet();
                    this.setState({
                        adrBip44Test: "Address: " + wallet.getAddressString()
                    });*/
                    let mnemonic = "test pizza drift whip rebel empower flame mother service grace sweet kangaroo";
                    let seed = bip39.mnemonicToSeedHex(mnemonic);
                    let rootKey = Bitcoin.HDNode.fromSeedHex(seed);
                    var bip32ExtendedKey = rootKey.derivePath("m/44'/60'/0'/0");
                    this.setState({
                        rootKey: "Bip32 Private extended key: " + bip32ExtendedKey.toBase58(),
                        xpub : "Bip32 Public extended key: " + bip32ExtendedKey.neutered().toBase58()
                    });
                    bip32ExtendedKey = bip32ExtendedKey.derive(0);
                    var keyPair = bip32ExtendedKey.keyPair;
                    var privKeyBuffer = keyPair.d.toBuffer(32);
                    var privkey = privKeyBuffer.toString('hex');
                    var ethUtil = require('ethereumjs-util');
                    var addressBuffer = ethUtil.privateToAddress(privKeyBuffer);
                    var hexAddress = addressBuffer.toString('hex');
                    var checksumAddress = ethUtil.toChecksumAddress(hexAddress);
                    var address = ethUtil.addHexPrefix(checksumAddress);
                    console.log("Ethereum address: [" + address  + "]")
                    privkey = ethUtil.addHexPrefix(privkey);
                    var pubkey = ethUtil.addHexPrefix(pubkey);
                    this.setState({
                        adrBip44Test: "Address: " + address,
                        pubkey: "Public key: " + pubkey,
                        privkey: "Private key: " + privkey
                    });
                }}/>
                <Button title='View balance' onPress={() => {
                    let Web3 = require('web3');
                    const testnet = 'https://ropsten.infura.io/Onb2hCxHKDYIL0LNn8Ir';
                    let walletAddress = this.state.adrBip44Test;
                    const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
                    web3.eth.getBalance(walletAddress).then( (data)=> {
                        console.log(data);
                        let value = web3.utils.fromWei(data);
                        this.setState({
                            balance: "Balance: " + value
                        });
                    });
                }}/>
                <Text style={styles.instructions}>
                    {this.state.seedTest}
                    {}
                </Text>
                <Text style={styles.instructions}>
                    {this.state.rootKey}
                    {}
                </Text>
                <Text style={styles.instructions}>
                    {this.state.xpub}
                    {}
                </Text>
                <Text style={styles.instructions}>
                    {this.state.adrBip44Test}
                    {'\n'}
                    {this.state.pubkey}
                    {'\n'}
                    {this.state.privkey}
                </Text>
                <Text style={styles.instructions}>
                    {this.state.balance}
                    {}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});