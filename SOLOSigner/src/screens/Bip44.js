import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, View, Alert } from 'react-native';
import Bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'bip39';
const testnet = 'https://ropsten.infura.io/'; //Onb2hCxHKDYIL0LNn8Ir
import Web3 from 'web3';

type Props = {};
export default class Bip44 extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            rootKey: '',
            adrBip44Test: '',
            privKeyBuffer: '',
            adrTest2: '0x213DE50319F5954D821F704d46e4fd50Fb09B459',
            seed: this.props.seed
        };
    }

    displayAlert(type, content){
        Alert.alert(
            type,
            content,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
    }

    loadBalances() {
        
        const walletAddress = this.state.adrBip44Test;
        const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
        console.log(walletAddress);
        web3.eth.getBalance(walletAddress).then((data) => {
            console.log(data);
            let value = web3.utils.fromWei(data);
            this.setState({
                balance: value
            });
        });
        web3.eth.getBalance(this.state.adrTest2).then((data) => {
            console.log(data);
            let value = web3.utils.fromWei(data);
            this.setState({
                balance2: value
            });
        });
    }

    render() {
        return (
            <View key="bip44" style={styles.container}>
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
                }} />
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
                        xpub: "Bip32 Public extended key: " + bip32ExtendedKey.neutered().toBase58()
                    });
                    bip32ExtendedKey = bip32ExtendedKey.derive(0);
                    var keyPair = bip32ExtendedKey.keyPair;
                    this.state.privKeyBuffer = keyPair.d.toBuffer(32);
                    var privkey = this.state.privKeyBuffer.toString('hex');
                    var ethUtil = require('ethereumjs-util');
                    var addressBuffer = ethUtil.privateToAddress(this.state.privKeyBuffer);
                    var hexAddress = addressBuffer.toString('hex');
                    var checksumAddress = ethUtil.toChecksumAddress(hexAddress);
                    var address = ethUtil.addHexPrefix(checksumAddress);
                    console.log("Ethereum address: [" + address + "]")
                    privkey = ethUtil.addHexPrefix(privkey);
                    var pubkey = ethUtil.addHexPrefix(pubkey);
                    this.setState({
                        adrBip44Test: address,
                        privkey: privkey
                    });
                }} />
                <Button title='View balance' onPress={() => {
                    this.loadBalances();
                }} />
                <Button title='Send 1 ETH to account 2' onPress={() => {
                    const EthereumTx = require('ethereumjs-tx');
                    //Create a new transaction
                    const txParams = {
                        nonce: '00',
                        gasPrice: 5000000000,
                        gasLimit: 210000,
                        to: this.state.adrTest2,
                        value: '1',
                        data: '0x00',
                        // EIP 155 chainId - mainnet: 1, ropsten: 3
                        chainId: 3
                    }
                    const tx = new EthereumTx(txParams);
                    //var key = new Buffer(this.state.privkey, 'hex');
                    tx.sign(this.state.privKeyBuffer);
                    const serializedTx = tx.serialize();
                    const web3 = new Web3(
                        new Web3.providers.HttpProvider(testnet)
                    );
                    //Verify connection is successful
                    web3.eth.net.isListening()
                        .then(() => console.log('is connected'))
                        .catch(e => console.log('Wow. Something went wrong'));
                    let data = `0x${serializedTx.toString('hex')}`;
                    web3.eth.sendSignedTransaction(data,
                        (error, result) => {
                            if (error) { 
                                console.log(`Error: ${error}`);
                                this.displayAlert("Error", error.message); 
                            }
                            else { 
                                console.log(`Result: ${result}`);
                                this.displayAlert("Result", result.data);
                            }
                        }
                    );
                }} />
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
                    Address 1: {this.state.adrBip44Test}
                    {'\n'}
                    Address 1 - Private key: {this.state.privkey}
                    {'\n'}
                    Address 2: {this.state.adrTest2}
                </Text>
                <Text style={styles.instructions}>
                    Balance of address 1: {this.state.balance}
                    {'\n'}
                    Balance of address 2: {this.state.balance2}
                    {'\n'}
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