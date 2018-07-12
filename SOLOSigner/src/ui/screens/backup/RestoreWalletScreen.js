import React from "react";
import {Platform, TouchableOpacity, View} from 'react-native';
import StyleSheet from "react-native-extended-stylesheet";
import {Actions} from "react-native-router-flux";
import RNFileSelector from 'react-native-file-selector';
import RNFileSystem from "react-native-fs";
import WalletManager from '../../../services/WalletService';
import {Button, QRCodeScanner, ScreenFooterActions, Text, TextInput} from "../../components";
import PermissionUtils from "../../../helpers/PermissionUtils";
import Constant from "../../../helpers/Constants";
import bip39 from 'bip39';

export default class RestoreWalletScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loadedBackupData: false, errorMessage: '', backupPhraseValidSate: -1};
    }

    openFileChooser = () => {
        PermissionUtils.requestStoragePermission().then(granted => {
            if (granted) {
                let fileSelectorProps = {
                    title: 'Choose backup file',
                    filter: Platform.select({ios: [], android: ".*\\.png$|.*\\.txt$"}),
                    onDone: this.doReadFile
                };

                RNFileSystem.exists(Constant.BACKUP_FOLDER).then(existing => {
                    if (existing) fileSelectorProps.path = Constant.BACKUP_FOLDER;
                    RNFileSelector.Show(fileSelectorProps);
                });
            }
        });
    };

    doReadFile = path => {
        if (path && path.toLowerCase().endsWith('png')) {
            //base64
        } else if (path && path.toLowerCase().endsWith('txt')) {
            RNFileSystem.readFile(path, 'utf8').then(data => {
                this.onReceiveData(data);
            });
        }
    };

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
            let result = WalletManager.restoreWallet(this.encryptedData, this.encryptPassword);
            if (bip39.validateMnemonic(result)) {
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

    render() {
        return (
            <View style={styles.container}>
                <Text style={StyleSheet.value('$screen_title_text')}>Restore Wallet</Text>

                <Text style={StyleSheet.value('$screen_sub_title_text')}>
                    Restore your encrypted wallet that you backup before.
                </Text>

                {
                    !this.state.loadedBackupData &&
                    <View style={styles.contain_container}>
                        <Text style={[StyleSheet.value('$screen_explain_text'), styles.section_text]}>
                            Choose the way you want to restore:
                        </Text>

                        <Button
                            title='Choose backup file'
                            textStyle={styles.button_choose_file}
                            onPress={this.openFileChooser}/>

                        <View style={styles.separator_container}>
                            <View style={styles.dash}/>
                            <Text style={styles.separator_text}>OR</Text>
                            <View style={styles.dash}/>
                        </View>

                        <QRCodeScanner
                            cameraSize={180}
                            onCodeRead={data => this.onReceiveData(data)}/>
                    </View>
                }
                {
                    this.state.loadedBackupData &&
                    <View style={styles.contain_container}>
                        <Text style={[StyleSheet.value('$screen_explain_text'), styles.section_text]}>
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
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal'
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
        marginBottom: '$screen_padding_bottom',
        alignItems: 'center',
    },
    button_choose_file: {
        borderWidth: 0,
        color: '$primaryColor',
        fontFamily: '$primaryFontBold',
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
    input_password: {
        width: '100%',
        height: 45,
        marginTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },
    error_text: {
        width: '100%',
        color: '$errorColor',
        fontSize: 12,
        marginTop: 15,
    },
});