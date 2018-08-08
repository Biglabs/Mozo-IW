import React from "react";
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Actions} from "react-native-router-flux";
import QRCode from 'react-native-qrcode-svg';

import {
    colorBorder,
    colorPrimary,
    colorScreenBackground,
    colorTitleText,
    dimenScreenPaddingTop,
    fontBold,
    icons,
    styleWarningText
} from '../../../res';
import {ScreenFooterActions, ScreenHeaderActions, Text, SvgView} from "../../components";

import { WalletService as WalletManager } from "../../../services";
import { strings } from '../../../helpers/i18nUtils';
import Constant from '../../../helpers/Constants';

export default class ViewBackupPhraseScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            countDownDuration: 5,
            userConfirmed: false,
        };
        let result = WalletManager.viewBackupPhrase(this.props.pin);
        //let result = service.manageWallet.viewBackupPhrase(this.props.pin);

        if (result) {
            this.doViewBackupPhrase(result);
        } else {
            Alert.alert(
                Constant.ERROR_TYPE.CANNOT_VIEW_BACKUP_PHRASE.title,
                Constant.ERROR_TYPE.CANNOT_VIEW_BACKUP_PHRASE.detail,
                [{text: strings('alert.btnOK'), onPress: () => Actions.pop()},],
                {cancelable: false}
            )
        }
    }

    doViewBackupPhrase(result) {
        this.backupPhrase = result;
        this.arrayOfWords = result.split(" ");
        this.countDownHandler = () => {
            if (Actions.currentScene === 'view_backup_phrase') {
                this.setState({
                    countDownDuration: --this.state.countDownDuration
                }, () => this.startTimerCountDown());
            }
        };
        this.startTimerCountDown();
    }

    componentWillUnmount() {
        clearTimeout(this.countDownHandler);
    }

    startTimerCountDown() {
        if (this.state.countDownDuration > 0) {
            setTimeout(this.countDownHandler, 1000);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScreenHeaderActions title={strings('view_backup_phrase.lbTitle')}/>

                {
                    !this.state.userConfirmed &&
                    <View style={styles.state_container}>
                        <View style={styles.warning_text}>
                            <SvgView
                                width={20}
                                height={20}
                                svg={icons.icWarning}
                                style={{marginRight: 6}}
                            />
                            <Text style={[styleWarningText, {paddingBottom: 4}]}>{strings('view_backup_phrase.lbWarning')}</Text>
                        </View>

                        <Text style={styles.explain_text}>
                            {strings('view_backup_phrase.lbWarningDetail')}
                        </Text>
                    </View>
                }

                {
                    this.state.countDownDuration > 0 &&
                    <Text style={styles.count_down_text}>{this.state.countDownDuration}</Text>
                }
                {
                    !this.state.userConfirmed &&
                    <ScreenFooterActions
                        rightButtonText={strings('view_backup_phrase.btnUnderstand')}
                        onBackPress={() => Actions.pop()}
                        enabledContinue={this.state.countDownDuration === 0}
                        onContinuePress={() => this.setState({userConfirmed: true})}/>
                }

                {
                    this.state.userConfirmed &&
                    <View style={styles.state_container}>
                        <Text style={[styles.explain_text, styles.explain_qr_code_text]}>
                            {strings('view_backup_phrase.lbScan')}
                        </Text>

                        <View style={styles.image_qr_code}>
                            <QRCode value={this.backupPhrase} size={120}/>
                        </View>

                        <View style={styles.phrase_container}>
                            {
                                this.arrayOfWords.map(word => {
                                    return <Text key={word} style={styles.item_word}>{word}</Text>
                                })
                            }
                        </View>

                        <TouchableOpacity
                            style={styles.button_cancel_container}
                            onPress={() => Actions.pop()}>
                            <SvgView
                                width={18}
                                height={18}
                                fill={colorPrimary}
                                svg={icons.icCancel}
                                style={{marginRight: 4}}
                            />
                            <Text style={styles.button_cancel}>{strings('view_backup_phrase.btnCancel')}</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScreenBackground,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    state_container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },
    warning_text: {
        marginTop: dimenScreenPaddingTop,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    explain_text: {
        color: colorTitleText,
        marginLeft: 50,
        marginRight: 50,
        fontSize: 14,
        textAlign: 'justify',
    },
    explain_qr_code_text: {
        textAlign: 'center',
        marginTop: 36,
    },
    image_qr_code: {
        width: 160,
        height: 160,
        marginTop: 16,
        marginBottom: 40,
        borderColor: '#b4b4b4',
        borderWidth: 1,
        backgroundColor: colorScreenBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    count_down_text: {
        fontSize: 16,
        color: colorPrimary,
        position: 'absolute',
        bottom: 30,
    },
    item_word: {
        color: colorPrimary,
        fontFamily: fontBold,
        fontSize: 14,
        padding: 5,
    },
    phrase_container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: colorBorder,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 50,
        paddingTop: 20,
        paddingRight: 50,
        paddingBottom: 22,
    },
    button_cancel_container: {
        padding: 6,
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_cancel: {
        color: colorTitleText,
        fontSize: 16,
        fontFamily: fontBold,
        marginBottom: 2,
    }
});