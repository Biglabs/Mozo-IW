import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TextInput, Keyboard, TouchableWithoutFeedback, Alert} from 'react-native';
import { Actions } from 'react-native-router-flux';

let encryption = require('../common/encryption');
var bip38 = require('bip38')
var wif = require('wif')

const DissmissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

type Props = {};
export default class Bip38 extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            encryptedKey: '',
            decryptedKey: '',
            passphrase: '',
            address: this.props.seed
        };
    }

    scanQRCodeCallback(qrcode) {
      this.setState({address: qrcode});
    }

    render() {
        return (
          <DissmissKeyboard>
            <View key="bip38" style={styles.container}>
                <Text>Address: </Text>
                <TextInput
                  value={this.state.address}
                  style={styles.textinput}
                  placeholder="Type address here to encrypt or decrypt!"
                  onChangeText={(address) => this.setState({address})}
                />

                <Text>passphrase: </Text>
                <TextInput
                  style={styles.textinput}
                  defaultValue="TestingOneTwoThree"
                  placeholder="Type passphrase here to encrypt or decrypt!"
                  onChangeText={(passphrase) => this.setState({passphrase})}
                />

                <Button title='Encrypt' onPress={() => {
                    // let decoded = wif.decode(this.state.address)
                    // let encryptedKey = bip38.encrypt(decoded.privateKey, decoded.compressed, this.state.passphrase)

                    let encrypted = encryption.encrypt(this.state.address, this.state.passphrase);
                    // Generate BIP38 from BIP44
                    this.setState({
                        encryptedKey: 'encryptedKey: ' + encrypted,
                        decryptedKey: '',
                        passphrase: 'TestingOneTwoThree',
                        address: ''
                    });
                }}/>
                <Button title='Decrypt' onPress={() => {
                    // let decryptedKey = bip38.decrypt(this.state.address, this.state.passphrase, function (status) {
                    //   console.log(status.percent) // will print the percent every time current increases by 1000
                    // })
                    // // Generate BIP38 from BIP44
                    // this.setState({
                    //     encryptedKey: '',
                    //     decryptedKey: 'decryptedKey: ' + wif.encode(0x80, decryptedKey.privateKey, decryptedKey.compressed),
                    //     passphrase: 'TestingOneTwoThree',
                    //     address: ''
                    // });

                    try {
                        let decrypted = encryption.decrypt(this.state.address, this.state.passphrase);
                        this.setState({
                            encryptedKey: '',
                            decryptedKey: 'decryptedKey: ' + decrypted,
                            passphrase: 'TestingOneTwoThree',
                            address: ''
                        });
                    } catch (e) {
                        console.log(e.message);
                    }
                }}/>

                <Button title="Export QR code" onPress={() => Actions.export_qrcode({data: this.state.address})} />
                <Button title='Import QR code' onPress={() =>
                  this.props.navigation.navigate('scan_qrcode', {scanQRCodeCallback: this.scanQRCodeCallback.bind(this)})
                }/>

                <Text selectable={true} style={styles.instructions}>
                    {this.state.decryptedKey}
                    {}
                </Text>
                <Text selectable={true} style={styles.instructions}>
                    {this.state.encryptedKey}
                    {}
                </Text>
            </View>
          </DissmissKeyboard>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textinput: {
      textAlign: 'left',
      margin: 10,
      borderWidth: 1,
      alignSelf: 'stretch',
      height: 40
    }
});
