import React, {Component} from "react";
import {ScrollView, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import SvgUri from 'react-native-svg-uri';
import {FooterActions, Text, TextInput} from "../../components/SoloComponent";
import {RNCamera} from 'react-native-camera';
import bip39 from 'bip39';

export default class ImportWalletScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isScanningQRCode: false,
            isPhraseValid: false,
            isShowError: false,
            backupPhrase: ''
        }
    }

    onSubmitPhrase(phrase) {
        let isValid = phrase && bip39.validateMnemonic(phrase);
        this.setState({
            backupPhrase: phrase,
            isPhraseValid: isValid,
            isShowError: !isValid
        }, () => {
            console.log(this.state.backupPhrase);
        });
    }

    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>Import/Restore Wallet</Text>

                <ScrollView
                    style={styles.scroll_container}
                    contentContainerStyle={{alignItems: 'center'}}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    overScrollMode='never'>

                    <Text style={StyleSheet.value('$screen_sub_title_text')}>
                        Type in your wallet’s Backup Phrase in the correct sequence below to pair.
                    </Text>

                    <TextInput
                        style={styles.phrase_input}
                        placeholder='Enter Backup Phrase'
                        multiline={true}
                        numberOfLines={3}
                        returnKeyType='done'
                        onFocus={() => this.setState({
                            isScanningQRCode: false
                        })}
                        blurOnSubmit={true}
                        value={this.state.backupPhrase}
                        onChangeText={text => this.onSubmitPhrase(text)}
                        onSubmitEditing={() => {
                        }}/>

                    <Text style={[styles.error_text, {opacity: this.state.isShowError ? 1 : 0}]}>
                        * Backup Phrase is invalid
                    </Text>

                    <View style={styles.separator_container}>
                        <View style={styles.dash}/>
                        <Text style={styles.separator_text}>OR BETTER YET</Text>
                        <View style={styles.dash}/>
                    </View>

                    <TouchableOpacity
                        disabled={this.state.isScanningQRCode}
                        onPress={() => this.setState({
                            isScanningQRCode: true
                        })}>
                        <SvgUri width={200}
                                height={200}
                                source={require('../../res/icons/ic_scan_area.svg')}/>
                        {
                            this.state.isScanningQRCode &&
                            <RNCamera
                                style={{width: 180, height: 180, position: 'absolute', top: 10, left: 10}}
                                ratio='1:1'
                                permissionDialogTitle={'Permission to use camera'}
                                permissionDialogMessage={'We need your permission to use your camera phone'}
                                onBarCodeRead={(event) => {
                                    this.setState({isScanningQRCode: false});
                                    this.onSubmitPhrase(event.data);
                                }}/>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{marginBottom: 30}}
                        onPress={() => this.setState({
                            isScanningQRCode: !this.state.isScanningQRCode
                        })}>
                        <Text style={styles.scan_text_button}>{
                            this.state.isScanningQRCode ? 'Cancel' : 'Scan QR Code'
                        }</Text>
                    </TouchableOpacity>
                </ScrollView>

                <FooterActions
                    onBackPress={() => Actions.pop()}
                    enabledContinue={this.state.isPhraseValid}
                    onContinuePress={() => {
                        Actions.security_pin()
                    }}/>
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
    scroll_container: {
        width: '100%',
        flex: 1,
        marginBottom: '$screen_padding_bottom',
    },
    phrase_input: {
        width: '100%',
        minHeight: 90,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

    },
    error_text: {
        width: '100%',
        color: '$errorColor',
        fontSize: 12
    },
    separator_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: 30,
    },
    separator_text: {
        color: '$textTitleColor',
        fontSize: 12,
        fontFamily: '$primaryFontBold',
        margin: 10,
    },
    dash: {
        width: 42,
        height: 1,
        backgroundColor: '$disableColor',
        marginTop: 2
    },
    scan_text_button: {
        color: '$primaryColor',
        fontFamily: '$primaryFontBold',
        padding: 5
    }
});