import React from "react";
import {Alert, AsyncStorage, Platform, TouchableOpacity, View} from 'react-native';
import StyleSheet from "react-native-extended-stylesheet";
import SvgUri from 'react-native-svg-uri';
import {Actions} from "react-native-router-flux";
import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs";
import Share from 'react-native-share';
import {icExportQR, icExportText} from "../../../res/icons/index";
import {ScreenFooterActions, ScreenHeaderActions, Text, TextInput} from "../../components";
import WalletManager from '../../../services/WalletService';
import PermissionUtils from "../../../helpers/PermissionUtils";
import Constant from "../../../helpers/Constants";
import {inject} from "mobx-react";

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
const backupFolder = Platform.select({
    ios: RNFS.DocumentDirectoryPath,
    android: `${RNFS.ExternalStorageDirectoryPath}/Documents`
}) + '/SoloSigner';

@inject("backupWalletStateStore")
export default class BackupWalletScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isShowError: false, errorMessage: '', errorViewIndex: -1};
        this.borderError = StyleSheet.value('$errorColor');
        this.borderNormal = StyleSheet.value('$borderColor');

        /* Create backup folder if not exist for both platform */
        RNFS.exists(backupFolder).then(existing => {
            if (!existing) RNFS.mkdir(backupFolder);
        });
    }

    doBackup() {
        if (this.validatePassword()) {
            let result = WalletManager.backupWallet(this.props.pin, this.newEncryptPassword);
            if (result) {
                this.setState({encryptedData: result});
            } else {
                Alert.alert(
                    'Something went wrong!',
                    "Cannot backup wallet right now, try again later.",
                    [{text: 'OK', onPress: () => Actions.pop()},],
                    {cancelable: false}
                )
            }

            this.newEncryptPassword = null;
            this.confirmEncryptPassword = null;
        }
    }

    doExportImage() {
        if (this.qrCode) {
            if (Platform.OS === 'ios') {
                this.qrCode.toDataURL(data => {
                    Share.open({url: `data:image/jpg;base64,${data}`})
                        .then(this.doHandleResult)
                        .catch(() => {
                            /* bypass Promise warning*/
                        });
                });
            } else {
                PermissionUtils.requestStoragePermission().then(granted => {
                    if (granted) {
                        this.qrCode.toDataURL(data => {
                            const today = new Date();
                            let filePath = `${backupFolder}/backup_wallet_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}.png`;
                            RNFS.writeFile(filePath, data, 'base64')
                                .then(() => {
                                    let shareOptions = {
                                        url: `file://${filePath}`,
                                    };
                                    Share.open(shareOptions)
                                        .then(this.doHandleResult);
                                });
                        });
                    }
                });
            }
        }
    }

    doExportText() {
        PermissionUtils.requestStoragePermission().then(granted => {
            if (granted) {
                const today = new Date();
                let filePath = `${backupFolder}/backup_wallet_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}.txt`;
                RNFS.writeFile(filePath, this.state.encryptedData)
                    .then(() => {
                        let shareOptions = {
                            url: `file://${filePath}`,
                        };

                        Share.open(shareOptions)
                            .then(this.doHandleResult)
                            .catch(() => {
                                /* bypass Promise warning*/
                            });
                    });
            }
        });
    }

    doHandleResult = (result) => {
        if (result) {
            this.props.backupWalletStateStore.setBackupWalletState(true);
            AsyncStorage.setItem(Constant.FLAG_BACKUP_WALLET, 'true');
        }
    };

    validatePassword() {
        if (this.newEncryptPassword && this.newEncryptPassword.length > 0) {
            if (passwordRegex.test(this.newEncryptPassword)) {
                if (this.newEncryptPassword !== this.confirmEncryptPassword) {
                    this.setState({isShowError: true, errorMessage: 'The password does not match', errorViewIndex: 1});
                    return false;
                }
            } else {
                this.setState({
                    isShowError: true,
                    errorMessage: 'Please choose a stronger password. Try a mix of letters, numbers, symbols and at least 8 characters.',
                    errorViewIndex: 0
                });
                return false;
            }
        } else {
            this.setState({isShowError: true, errorMessage: 'Password cannot be empty', errorViewIndex: 0});
            return false;
        }

        return true;
    }

    clearError() {
        this.setState({isShowError: false, errorMessage: '', errorViewIndex: -1});
    }

    render() {
        return (
            <View style={styles.container}>
                <ScreenHeaderActions title='Backup Wallet'/>

                {
                    !this.state.encryptedData &&
                    <View style={styles.view_contain}>
                        <Text
                            style={StyleSheet.value('$warning_text')}>
                            Your Backup Phrase will be encrypted. The encrypt password cannot be recovered.{'\n'}
                            Be sure to write it down.</Text>

                        <Text style={[StyleSheet.value('$screen_sub_title_text'), styles.text_sub_title]}>Enter a new
                            encrypt password</Text>

                        <Text style={StyleSheet.value('$screen_explain_text')}>
                            Use 8 or more characters with a mix of letters, numbers & symbols
                        </Text>
                        <TextInput
                            style={[styles.input_password, {borderColor: this.state.errorViewIndex === 0 ? this.borderError : this.borderNormal}]}
                            placeholder='Encrypt password'
                            multiline={false}
                            numberOfLines={1}
                            returnKeyType='next'
                            secureTextEntry={true}
                            onFocus={() => this.clearError()}
                            onChangeText={text => this.newEncryptPassword = text}/>

                        <TextInput
                            style={[styles.input_password, {borderColor: this.state.errorViewIndex === 1 ? this.borderError : this.borderNormal}]}
                            placeholder='Repeat the encrypt password'
                            multiline={false}
                            numberOfLines={1}
                            returnKeyType='done'
                            secureTextEntry={true}
                            onFocus={() => this.clearError()}
                            onChangeText={text => this.confirmEncryptPassword = text}
                            onSubmitEditing={() => this.doBackup()}/>

                        <Text style={[styles.error_text, {opacity: this.state.isShowError ? 1 : 0}]}>
                            * {this.state.errorMessage}
                        </Text>

                        <ScreenFooterActions onContinuePress={() => this.doBackup()}/>
                    </View>
                }
                {
                    this.state.encryptedData &&
                    <View style={[styles.view_contain, styles.view_result]}>
                        <Text>Your encrypted wallet:</Text>
                        <View style={styles.image_qr_code}>
                            <QRCode
                                size={200}
                                value={this.state.encryptedData}
                                getRef={(c) => (this.qrCode = c)}/>
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
                                onPress={() => this.doExportImage()}>
                                <SvgUri
                                    fill={StyleSheet.value('$primaryColor')}
                                    width={32}
                                    height={32}
                                    svgXmlData={icExportQR}/>
                                <Text style={styles.export_button_text}>{'\n'}QR Image file</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.export_button}
                                onPress={() => this.doExportText()}>
                                <SvgUri
                                    width={32}
                                    height={32}
                                    svgXmlData={icExportText}/>
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
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    view_contain: {
        width: '100%',
        flex: 1,
        paddingTop: '$screen_padding_top',
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal',
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
        color: '$errorColor',
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
        backgroundColor: '$screenBackground',
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
        fontFamily: '$primaryFontBold',
    },
    export_button: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    export_button_text: {
        fontFamily: '$primaryFontBold',
        color: '$textTitleColor'
    }
});