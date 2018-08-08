import React from "react";
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {inject} from "mobx-react";

import {
    colorError,
    colorPrimary,
    colorScreenBackground,
    colorTitleText,
    dimenScreenPaddingHorizontal,
    dimenScreenPaddingTop,
    fontBold,
    icons,
    styleScreenExplainText,
    styleScreenSubTitleText,
    styleWarningText,
} from "../../../res";
import {ScreenFooterActions, ScreenHeaderActions, SvgView, Text, TextInput} from "../../components";
import Constant from "../../../helpers/Constants";
import {isWebPlatform} from "../../../helpers/PlatformUtils";
import {WalletBackupService} from '../../../services';
import { strings } from '../../../helpers/i18nUtils';

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

@inject("backupWalletStateStore")
export default class BackupWalletScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isShowError: false, isReadyToBackup: false, errorMessage: '', errorViewIndex: -1};
    }

    componentWillUnmount() {
        this.qrCodeData = null;
        this.newEncryptPassword = null;
    }

    doExport(fileType) {
        const ignoreError = WalletBackupService.ERROR.USER_DENIED;
        // start code for desktop
        if (isWebPlatform()) {
            WalletBackupService
                .backupWallet(this.state.encryptedData, this.props.pin, this.newEncryptPassword, fileType, this.qrCodeData)
                .then(() => {
                    this.props.backupWalletStateStore.setBackupWalletState(true);
                })
                .catch(err => {
                    if (err.message !== ignoreError) {
                        Alert.alert(
                            Constant.ERROR_TYPE.CANNOT_BACKUP_WALLET.title,
                            Constant.ERROR_TYPE.CANNOT_BACKUP_WALLET.detail,
                            [{text: strings('alert.btnOK'), 
                            {cancelable: false}
                        );
                    }
                });
            // End code for desktop
        } else {
            if (this.qrCodeData != null) {
                this.qrCodeData.toDataURL(data => {
                    WalletBackupService.backupWallet(this.props.pin, this.newEncryptPassword, fileType, data)
                        .then(() => {
                            this.props.backupWalletStateStore.setBackupWalletState(true);
                        })
                        .catch(err => {
                            if (err.message && err.message !== ignoreError) {
                                Alert.alert(
                                    Constant.ERROR_TYPE.CANNOT_BACKUP_WALLET.title,
                                    Constant.ERROR_TYPE.CANNOT_BACKUP_WALLET.detail,
                                    [{text: strings('alert.btnOK'), 
                                    {cancelable: false}
                                );
                            }
                        });
                });
            }
        }
    }

    validatePassword() {
        if (this.newEncryptPassword && this.newEncryptPassword.length > 0) {
            if (passwordRegex.test(this.newEncryptPassword)) {
                if (this.newEncryptPassword !== this.confirmEncryptPassword) {
                    this.setState({isShowError: true, errorMessage: Constant.ERROR_TYPE.INCORRECT_CONFIRM_PASSWORD.detail, errorViewIndex: 1});
                    return false;
                }
            } else {
                this.setState({
                    isShowError: true,
                    errorMessage: Constant.ERROR_TYPE.WEAK_PASSWORD.detail,
                    errorViewIndex: 0
                });
                return false;
            }
        } else {
            this.setState({isShowError: true, errorMessage: Constant.ERROR_TYPE.EMPTY_PASSWORD.detail, errorViewIndex: 0});
            return false;
        }

        this.setState({
            isReadyToBackup: true,
            encryptedData: WalletBackupService.encryptWallet(this.props.pin, this.newEncryptPassword),
        });
    }

    clearError() {
        this.setState({isShowError: false, errorMessage: '', errorViewIndex: -1});
    }

    onQRCodeRendered = (data) => {
        console.log("onQRCodeRendered:" + data)
        this.qrCodeData = data;
        this.confirmEncryptPassword = null;
        this.state.encryptedData = null;
    };

    onQRCodeRenderedWeb = (data) => {
        if (isWebPlatform()) {
            this.qrCodeData = data;
            this.confirmEncryptPassword = null;
            this.state.encryptedData = null;
            /* try {
                var QRCode = require('qrcode')
                QRCode.toFile('filename.png', data.props.value);
            }
            catch(e) { 
                alert('Failed to save the file !'); 
            }

            console.log("onQRCodeRenderedWeb:" + data)
            this.qrCodeData = data;
            this.confirmEncryptPassword = null;
            this.state.encryptedData = null; */
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <ScreenHeaderActions title='Backup Wallet'/>

                {
                    !this.state.isReadyToBackup &&
                    <View style={styles.view_contain}>
                        <Text
                            style={styleWarningText}>
                            Your Backup Phrase will be encrypted. The encrypt password cannot be recovered.{'\n'}
                            Be sure to write it down.</Text>

                        <Text style={[styleScreenSubTitleText, styles.text_sub_title]}>Enter a new
                            encrypt password</Text>

                        <Text style={styleScreenExplainText}>
                            Use 8 or more characters with a mix of letters, numbers & symbols
                        </Text>
                        <TextInput
                            style={styles.input_password}
                            error={this.state.errorViewIndex === 0}
                            placeholder='Encrypt password'
                            multiline={false}
                            numberOfLines={1}
                            returnKeyType='next'
                            secureTextEntry={true}
                            onFocus={() => this.clearError()}
                            onChangeText={text => this.newEncryptPassword = text}/>

                        <TextInput
                            style={styles.input_password}
                            error={this.state.errorViewIndex === 1}
                            placeholder='Repeat the encrypt password'
                            multiline={false}
                            numberOfLines={1}
                            returnKeyType='done'
                            secureTextEntry={true}
                            onFocus={() => this.clearError()}
                            onChangeText={text => this.confirmEncryptPassword = text}
                            onSubmitEditing={() => this.validatePassword()}/>

                        <Text style={[styles.error_text, {opacity: this.state.isShowError ? 1 : 0}]}>
                            * {this.state.errorMessage}
                        </Text>

                        <ScreenFooterActions onContinuePress={() => this.validatePassword()}/>
                    </View>
                }
                {
                    this.state.isReadyToBackup &&
                    <View style={[styles.view_contain, styles.view_result]}>
                        <Text>Your encrypted wallet:</Text>
                        <View style={styles.image_qr_code}>
                            <QRCode
                                size={200}
                                value={this.state.encryptedData}
                                ref={this.onQRCodeRenderedWeb}
                                getRef={this.onQRCodeRendered}
                            />
                        </View>
                        <Text style={styles.export_explain_text}>
                            From the destination device, go to
                            <Text style={styles.export_explain_text_highlight}> Welcome screen </Text>
                            >
                            <Text style={styles.export_explain_text_highlight}> Restore Encrypted Wallet </Text>
                            and scan this QR code{'\n'}or save as file for restore later
                        </Text>
                        <View style={styles.export_container}>
                            <TouchableOpacity
                                style={styles.export_button}
                                onPress={() => this.doExport(Constant.BACKUP_FILE_TYPE.PNG)}>
                                <SvgView
                                    fill={colorPrimary}
                                    width={32}
                                    height={32}
                                    svg={icons.icExportQR}/>

                                <Text style={styles.export_button_text}>{'\n'}QR Image file</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.export_button}
                                onPress={() => this.doExport(Constant.BACKUP_FILE_TYPE.TXT)}>
                                <SvgView
                                    width={32}
                                    height={32}
                                    svg={icons.icExportText}/>
                                <Text style={styles.export_button_text}>{'\n'}Text file</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
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
    },
    view_contain: {
        width: '100%',
        flex: 1,
        paddingTop: dimenScreenPaddingTop,
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal,
    },
    view_result: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    text_sub_title: {
        marginTop: 20
    },
    input_password: {
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
    image_qr_code: {
        width: 240,
        height: 240,
        marginTop: 16,
        marginBottom: 20,
        borderColor: '#b4b4b4',
        borderWidth: 1,
        backgroundColor: colorScreenBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    export_container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
    },
    export_explain_text: {
        textAlign: 'center'
    },
    export_explain_text_highlight: {
        fontFamily: fontBold,
    },
    export_button: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    export_button_text: {
        fontFamily: fontBold,
        color: colorTitleText
    }
});