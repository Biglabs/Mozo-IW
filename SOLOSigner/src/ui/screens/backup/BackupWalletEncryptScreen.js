import React from "react";
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
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
import {ScreenFooterActions, ScreenHeaderActions, Text, TextInput} from "../../components";
import Constant from "../../../helpers/Constants";
import {WalletBackupService} from '../../../services';
import { strings } from '../../../helpers/i18nUtils';

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

export default class BackupWalletEncryptScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isShowError: false, errorMessage: '', errorViewIndex: -1};
    }

    componentWillUnmount() {
        this.newEncryptPassword = null;
    }

    doExport = () => {
        if(this.validatePassword()) {
            let encrypted = WalletBackupService.encryptWallet(this.props.pin, this.newEncryptPassword);
            Actions.replace('backup_wallet_export', {encryptedData: encrypted});
        }
    };

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
            return true;
        } else {
            this.setState({isShowError: true, errorMessage: Constant.ERROR_TYPE.EMPTY_PASSWORD.detail, errorViewIndex: 0});
            return false;
        }
    }

    clearError() {
        this.setState({isShowError: false, errorMessage: '', errorViewIndex: -1});
    }

    render() {
        return (
            <View style={styles.container}>
                <ScreenHeaderActions title='Backup Wallet'/>
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
                        onSubmitEditing={this.doExport}/>

                    <Text style={[styles.error_text, {opacity: this.state.isShowError ? 1 : 0}]}>
                        * {this.state.errorMessage}
                    </Text>

                    <ScreenFooterActions onContinuePress={this.doExport}/>
                </View>
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
    }
});
