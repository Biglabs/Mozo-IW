import React from "react";
import {ScrollView, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {QRCodeScanner, ScreenFooterActions, Text, TextInput} from "../../components";
import bip39 from 'bip39';

export default class ImportWalletScreen extends React.Component {

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

                <Text style={StyleSheet.value('$screen_title_text')}>Import Wallet</Text>

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

                    <QRCodeScanner
                        cameraSize={180}
                        scanning={this.state.isScanningQRCode}
                        onCodeRead={phrase => this.onSubmitPhrase(phrase)}/>
                </ScrollView>

                <ScreenFooterActions
                    onBackPress={() => Actions.pop()}
                    enabledContinue={this.state.isPhraseValid}
                    onContinuePress={() => {
                        Actions.security_pin({
                            isNewPIN: true,
                            importedPhrase: this.state.backupPhrase
                        })
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
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal'
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
        marginBottom: 20,
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
    }
});