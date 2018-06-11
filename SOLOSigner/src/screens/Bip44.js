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
                    var hdkey = require('ethereumjs-wallet-react-native/hdkey')
                    let seed = this.state.seed;
                    let mnemonic = "advice seat receive device street fever mean one curve lazy flight bundle fantasy item portion"; 
                    seed = bip39.mnemonicToSeedHex(mnemonic);
                    this.setState({
                        seedTest: "Seed: " + seed
                    });
                    var ethereumHDKey = hdkey.fromMasterSeed(seed);
                    ethereumHDKey = ethereumHDKey.derivePath("m/44'/60'/0'/0");
                    this.setState({
                        rootKey: "Private extended key: " + ethereumHDKey.privateExtendedKey(),
                        xpub : "Public extended key: " + ethereumHDKey.publicExtendedKey()
                    });
                    let wallet = ethereumHDKey.getWallet();
                    this.setState({
                        adrBip44Test: "Address: " + wallet.getAddressString()
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