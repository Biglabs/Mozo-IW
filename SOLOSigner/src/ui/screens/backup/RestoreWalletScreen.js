import React from "react";
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Actions} from "react-native-router-flux";
// import QrReader from 'react-qr-reader';

import { isWebPlatform } from "../../../helpers/PlatformUtils";

import {
    colorDisable,
    colorError,
    colorPrimary,
    colorScreenBackground,
    colorTitleText,
    dimenScreenPaddingBottom,
    dimenScreenPaddingHorizontal,
    fontBold,
    styleScreenExplainText,
    styleScreenSubTitleText,
    styleScreenTitleText,
} from '../../../res';
import {Button, QRCodeScanner, ScreenFooterActions, Text, TextInput} from "../../components";
// import WalletBackupService from '../../../services/WalletBackupService';
import { walletBackupService as WalletBackupService } from '../../../services';

export default class RestoreWalletScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loadedBackupData: false, errorMessage: '', backupPhraseValidSate: -1};

        // TODO: Remove later, for test
        this.handleScan = this.handleScan.bind(this);
    }

    onChooseFileClick() {
        let that = this;
        if(isWebPlatform) {
            const ipc = require('electron').ipcRenderer;
            // send command to main process
            ipc.send('open-file-dialog');
            ipc.on('selected-file', function (event, file) {
                console.log(file.toString());
                var fs = require('fs');
                fs.readFile(file, function(err, data) {
                    console.log(data.toString());
                    that.onReceiveData(data.toString());
                  });
            });
        } else {
            WalletBackupService.loadBackupFile(data => {
                this.onReceiveData(data);
            });
        }
    }

    onReceiveData(encryptedData) {
        this.setState({loadedBackupData: true});
        this.encryptedData = encryptedData;
    }

    onBackPress() {
        if (this.state.loadedBackupData) {
            this.encryptedData = null;
            this.encryptPassword = null;
            this.setState({loadedBackupData: false});
        } else {
            Actions.pop();
        }
    }

    onContinueClick() {
        if (this.encryptedData && this.checkPassword()) {
            let result = WalletBackupService.restoreWallet(this.encryptedData, this.encryptPassword);
            if (result) {
                this.state.backupPhraseValidSate = 1;
                Actions.security_pin({
                    isNewPIN: true,
                    importedPhrase: result
                })
            } else {
                this.setState({
                    errorMessage: 'Restore failed! Invalid encrypt password',
                    backupPhraseValidSate: 0
                });
            }
        }
    }

    checkPassword() {
        if (this.encryptPassword) return true;
        else {
            this.setState({
                errorMessage: 'Encrypt password is required',
                backupPhraseValidSate: 0
            });
            return false;
        }
    }

    clearError() {
        this.setState({
            errorMessage: '',
            backupPhraseValidSate: -1
        })
    }

    handleScan(result){
        if(result){
            console.log(result);
            this.onReceiveData(result);
            /* this.setState({ 
                backupPhrase: result 
            }); */
        }
    }
    handleError(err){
        console.error(err);
    }

    
    openImageDialog() {
        this.refs.qrReader.openImageDialog();
    }

    
    displayQRCodeScan(){
        if(isWebPlatform()){
            const QrReader = require('react-qr-reader');
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
                    onCodeRead={data => this.onReceiveData(data)}/>
            );
        }
        
        
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styleScreenTitleText}>Restore Wallet</Text>

                <Text style={styleScreenSubTitleText}>
                    Restore your encrypted wallet that you backup before.
                </Text>

                {
                    !this.state.loadedBackupData &&
                    <View style={styles.contain_container}>
                        <Text style={[styleScreenExplainText, styles.section_text]}>
                            Choose the way you want to restore:
                        </Text>

                        {/*<Button*/}
                            {/*title='Choose backup file'*/}
                            {/*textStyle={styles.button_choose_file}*/}
                            {/*onPress={() => this.onChooseFileClick()}/>*/}

                        {/*<View style={styles.separator_container}>*/}
                            {/*<View style={styles.dash}/>*/}
                            {/*<Text style={styles.separator_text}>OR</Text>*/}
                            {/*<View style={styles.dash}/>*/}
                        {/*</View>*/}

                        {/* <QRCodeScanner
                            cameraSize={180}
                            onCodeRead={data => this.onReceiveData(data)}/> */}
                    </View>
                }
                {
                    this.state.loadedBackupData &&
                    <View style={styles.contain_container}>
                        <Text style={[styleScreenExplainText, styles.section_text]}>
                            Enter your encrypt password:
                        </Text>

                        <TextInput
                            style={styles.input_password}
                            error={this.state.backupPhraseValidSate === 0}
                            placeholder='Encrypt password'
                            multiline={false}
                            numberOfLines={1}
                            returnKeyType='done'
                            secureTextEntry={true}
                            onFocus={() => this.clearError()}
                            onChangeText={text => this.encryptPassword = text}/>

                        <Text style={[styles.error_text, {opacity: this.state.backupPhraseValidSate === 0 ? 1 : 0}]}>
                            * {this.state.errorMessage}
                        </Text>
                    </View>
                }

                <ScreenFooterActions
                    onBackPress={() => this.onBackPress()}
                    enabledContinue={this.state.loadedBackupData}
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
    section_text: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10
    },
    contain_container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        marginBottom: dimenScreenPaddingBottom,
        alignItems: 'center',
    },
    button_choose_file: {
        borderWidth: 0,
        color: colorPrimary,
        fontFamily: fontBold,
        fontSize: 14,
        paddingTop: 20,
        paddingBottom: 20,
    },
    separator_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    input_password: {
        width: '100%',
        height: 45,
        marginTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },
    error_text: {
        width: '100%',
        color: colorError,
        fontSize: 12,
        marginTop: 15,
    },
});