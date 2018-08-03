import React from "react";
import {ScrollView, StyleSheet, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import bip39 from 'bip39';

import {QRCodeScanner, ScreenFooterActions, Text, TextInput} from "../../components";
import {
    colorDisable,
    colorError,
    colorScreenBackground,
    colorTitleText,
    dimenScreenPaddingBottom,
    dimenScreenPaddingHorizontal,
    fontBold,
    styleScreenSubTitleText,
    styleScreenTitleText,
} from '../../../res';

export default class ImportWalletScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isScanningQRCode: false,
            isPhraseValid: false,
            isShowError: false,
            backupPhrase: '',
            delay: 100,
            result: 'No result'
        }

        // TODO: Remove later, for test
        this.handleScan = this.handleScan.bind(this);
    }

    onSubmitPhrase(phrase) {
        let isValid = phrase && bip39.validateMnemonic(phrase);
        this.setState({
            backupPhrase: phrase,
            isPhraseValid: isValid,
            isShowError: !isValid
        });
    }

    onContinueClick() {
        if (this.state.isPhraseValid) {
            Actions.security_pin({
                isNewPIN: true,
                importedPhrase: this.state.backupPhrase
            })
        }
    }

    handleScan(result){
        console.log(result);
        if(result){
            // console.log(result);
        this.onSubmitPhrase(result);
          /*  this.setState({ 
                backupPhrase: result 
            }); */
        }
    }
    handleError(err){
        console.error(err);
    }

    /*
  openImageDialog() {
       // this.refs.qrReader.openImageDialog();
   }

   displayQRCodeScan(){
       import QrReader from 'react-qr-reader';
       if(isWebPlatform()){
           const previewStyle = {
               height: 180,
               width: 180,
           };
           return (
               <div>
                   <QrReader
                       ref="qrReader"
                       delay={this.state.delay}
                       style={previewStyle}
                       onError={this.handleError}
                       onScan={this.handleScan}
                       legacyMode
                   />
                   <input type="button" value="Submit QR Code" onClick={()=> this.openImageDialog()} />
               </div>
           );
       } else {
           return (
               <QRCodeScanner
                   cameraSize={180}
                   scanning={this.state.isScanningQRCode}
                   onCodeRead={phrase => this.onSubmitPhrase(phrase)}/>
           );
       }


   }
*/
    render() {
        return (
            <View style={styles.container}>

                <Text style={styleScreenTitleText}>Import Wallet</Text>

                <ScrollView
                    style={styles.scroll_container}
                    contentContainerStyle={{alignItems: 'center'}}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    overScrollMode='never'>

                    <Text style={styleScreenSubTitleText}>
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
                    onContinuePress={() => this.onContinueClick()}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: colorScreenBackground,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal
    },
    scroll_container: {
        width: '100%',
        flex: 1,
        marginBottom: dimenScreenPaddingBottom,
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
        color: colorError,
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
        color: colorTitleText,
        fontSize: 12,
        fontFamily: fontBold,
        margin: 10,
    },
    dash: {
        width: 42,
        height: 1,
        backgroundColor: colorDisable,
        marginTop: 2
    }
});