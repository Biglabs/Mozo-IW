import React from "react";
import {TouchableOpacity, View} from 'react-native';
import StyleSheet from "react-native-extended-stylesheet";
import {Actions} from "react-native-router-flux";
import RNFileSelector from 'react-native-file-selector';
import RNFileSystem from "react-native-fs";
import WalletManager from '../../utils/WalletManager';
import {Button, QRCodeScanner, ScreenFooterActions, Text, TextInput} from "../../components";
import PermissionUtils from "../../utils/PermissionUtils";
import Constant from "../../common/Constants";

export default class RestoreWalletScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loadedBackupData: false, backupPhrase: ''};
    }

    openFileChooser = () => {
        PermissionUtils.requestStoragePermission().then(granted => {
            if (granted) {
                let fileSelectorProps = {
                    title: 'Choose backup file',
                    filter: ".*\\.png$|.*\\.txt$",
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

    doDecryptData() {
        if (this.encryptedData && this.encryptPassword) {
            let result = WalletManager.restoreWallet(this.encryptedData, this.encryptPassword);
            this.setState({backupPhrase: result})
        }
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
                            placeholder='Encrypt password'
                            multiline={false}
                            numberOfLines={1}
                            returnKeyType='done'
                            secureTextEntry={true}
                            onChangeText={text => this.encryptPassword = text}/>

                        <Text>backupPhrase: {this.state.backupPhrase}</Text>
                    </View>
                }

                <ScreenFooterActions
                    onBackPress={() => this.onBackPress()}
                    enabledContinue={this.state.loadedBackupData}
                    onContinuePress={() => this.doDecryptData()}/>
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
});