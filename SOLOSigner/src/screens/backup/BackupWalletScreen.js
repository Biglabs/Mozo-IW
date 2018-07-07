import React from "react";
import {Alert, Platform, TouchableOpacity, View} from 'react-native';
import StyleSheet from "react-native-extended-stylesheet";
import SvgUri from 'react-native-svg-uri';
import {Actions} from "react-native-router-flux";
import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs";
import Share from 'react-native-share';
import {icCheck, icExportQR, icExportText} from "../../res/icons";
import {NavigationBar, Text, TextInput} from "../../components/SoloComponent";
import WalletManager from '../../utils/WalletManager';
import PermissionUtils from "../../utils/PermissionUtils";

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
const backupFolder = Platform.select({
    ios: RNFS.DocumentDirectoryPath,
    android: `${RNFS.ExternalStorageDirectoryPath}/Documents`
}) + '/SoloSigner';

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
        PermissionUtils.requestStoragePermission().then(granted => {
            if (granted && this.qrCode) {
                this.qrCode.toDataURL(data => {

                    let shareOptions = {
                        url: `data:image/jpg;base64,${data}`,
                    };

                    Share.open(shareOptions)
                        .then((res) => console.log('res:', res))
                        .catch(err => console.log('err', err))
                });
            } else {
                console.warn("doExportImage: " + granted + ", qrCode: " + this.qrCode);
            }
        });
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
                            .then((res) => console.log('res:', res))
                            .catch(err => console.log('err', err))
                    });
            }
        });
    }

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
                <NavigationBar title='Backup Wallet'/>

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

                        <TouchableOpacity
                            style={styles.button_confirm}
                            onPress={() => this.doBackup()}>
                            <SvgUri
                                fill={StyleSheet.value('$primaryColor')}
                                width={20}
                                height={20}
                                svgXmlData={icCheck}/>
                            <Text style={styles.button_confirm_text}>Confirm</Text>
                        </TouchableOpacity>
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
                        <Text style={{textAlign: 'center'}}>
                            From the destination device, go to Welcome screen > Import Wallet{'\n'}and scan this QR code
                        </Text>
                        <Text>or save as file for restore later</Text>
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
    button_confirm: {
        height: '$screen_padding_bottom',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: '36%',
        right: '36%',
    },
    button_confirm_text: {
        color: '$textTitleColor',
        fontSize: 16,
        fontFamily: '$primaryFontBold',
        marginBottom: 2,
        marginLeft: 5,
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