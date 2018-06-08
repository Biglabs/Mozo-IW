/**
 * SOLo Signer App
 * https://github.com/Biglabs/Mozo-IW/tree/master/SOLOSigner
 * @flow
 */

import React, {Component} from 'react';
import {Button, Picker, Platform, StyleSheet, Text, View, Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';

import bip39 from 'bip39';

type Props = {};
export default class Bip39 extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            language: bip39.wordlists.english,
            mnemonic: '',
            seed: ''
        };
    }

    generatePhrase(screenKey?: string) {
        this.setState({
            mnemonic: bip39.generateMnemonic(128, null, this.state.language),
            seed: bip39.mnemonicToSeedHex(this.state.mnemonic)
        }, () => {
            if (screenKey) {
                Actions.jump(screenKey, {seed: this.state.seed});
            }
        });
    }

    render() {
        const languages = {
            "English": bip39.wordlists.english,
            "Japanese": bip39.wordlists.japanese,
            "Spanish": bip39.wordlists.spanish,
            "Chinese Simplified": bip39.wordlists.chinese_simplified,
            "Chinese Traditional": bip39.wordlists.chinese_traditional,
            "French": bip39.wordlists.french,
            "Italian": bip39.wordlists.italian,
            "Korean": bip39.wordlists.korean
        };

        return (
            <View key="bip39" style={styles.container}>
                <Picker style={{height: 50, width: 200}}
                        selectedValue={this.state.language}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({language: itemValue}, () => this.generatePhrase());
                        }}>
                    {Object.keys(languages).map((key) => {
                        return (<Picker.Item label={key} value={languages[key]}/>)
                    })}
                </Picker>

                <Text style={styles.text}>
                    {this.state.mnemonic}
                    {console.log(this.state.mnemonic)}
                </Text>
                <Text style={styles.text}>
                    {this.state.seed}
                    {console.log(this.state.seed)}
                </Text>

                <Button title='create recovery phrase' onPress={() => this.generatePhrase("tab_bip44")}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        textAlign: 'center',
        color: '#333333',
        margin: 5,
    },
});