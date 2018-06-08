import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, Alert} from 'react-native';
import Bitcoin from 'react-native-bitcoinjs-lib';

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
                <Button title='test bip44 from bip39' onPress={() => {
                    // Generate BIP32 Root Key from BIP39 Seed
                    let rootKey = Bitcoin.HDNode.fromSeedHex(this.state.seed, Bitcoin.networks.testnet);
                    this.setState({
                        rootKey: "Root key: " + rootKey.toBase58()
                    });
                    // 2 levels of 0' here as per BIP44 spec
                    var childKey = rootKey.deriveHardened(44);
                    childKey.deriveHardened(1); //Coin type: Ethereum, should use 60
                    childKey.deriveHardened(0); //Account
                    childKey.deriveHardened(0); //External/Internal
                    childKey.derive(0);
                    this.setState({
                        adrBip44Test: childKey.getAddress()
                    });
                }}/>
                <Text style={styles.instructions}>
                    {this.state.rootKey}
                    {}
                </Text>
                <Text style={styles.instructions}>
                    {this.state.adrBip44Test}
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