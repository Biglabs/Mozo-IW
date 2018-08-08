import React from "react";
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Bip39 from 'bip39';

import {ScreenFooterActions, Text} from "../../components";
import {
    colorBorder,
    colorDisable,
    colorPrimary,
    colorScreenBackground,
    dimenScreenPaddingBottom,
    dimenScreenPaddingHorizontal,
    fontBold,
    styleScreenExplainText,
    styleScreenTitleText,
    styleWarningText
} from '../../../res';

const phraseLanguage = Bip39.wordlists.english;
const phraseLength = 12; //[12 ... 24]

export default class BackupPhraseConfirmScreen extends React.Component {

    constructor(props) {
        super(props);
        this.phrase = Bip39.generateMnemonic(phraseLength * 32 / 3, null, phraseLanguage);
        this.state = {
            isUserHasRead: false,
        };
    }

    onContinueClicked() {
        Actions.backup_phrase_confirm({phrase: this.phrase, coinTypes: this.props.coinTypes});
    }

    openSecurityPin() {
        Actions.security_pin({isNewPIN: true, importedPhrase: this.phrase, coinTypes: this.props.coinTypes});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styleScreenTitleText}>Backup Phrase</Text>
                <Text style={styleScreenExplainText}>
                    Please write it down on a paper and keep it in a safe place as you would with paper money
                </Text>

                <Text style={[styleWarningText, {marginTop: 10}]}>
                    If you lose your recovery phase, your wallet cannot be recovered.
                </Text>

                <View style={[styles.word_display_container, styles.phrase_container]}>
                    {
                        this.phrase.split(" ").map(word => {
                            return <Text key={word} style={styles.item_word}>{word}</Text>
                        })
                    }
                </View>

                <TouchableOpacity
                    style={styles.radio_user_confirm}
                    onPress={() => this.setState({isUserHasRead: !this.state.isUserHasRead})}>
                    <View style={styles.radios}>
                        {
                            this.state.isUserHasRead && <View style={styles.radios_checked}/>
                        }
                    </View>

                    <Text style={styles.radio_user_confirm_text}>I have safely stored recovery phrase</Text>
                </TouchableOpacity>

                <View style={styles.dash}/>


                <ScreenFooterActions
                    enabledContinue={this.state.isUserHasRead}
                    onContinuePress={() => this.onContinueClicked()}/>
                <TouchableOpacity
                    style={styles.button_skip}
                    onPress={() => this.openSecurityPin()}>
                    <Text style={styles.button_skip_text}>Skip</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScreenBackground,
        flex: 1,
        flexDirection: 'column',
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal
    },
    word_display_container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
    },
    phrase_container: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: colorBorder,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 50,
        paddingTop: 20,
        paddingRight: 50,
        paddingBottom: 22,
        top: 225,
    },
    item_word: {
        color: colorPrimary,
        fontFamily: fontBold,
        fontSize: 14,
        padding: 5,
    },
    radio_user_confirm: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: dimenScreenPaddingHorizontal,
        right: dimenScreenPaddingHorizontal,
        bottom: 90,
    },
    radio_user_confirm_text: {
        fontFamily: fontBold,
        fontSize: 14
    },
    radios: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: colorBorder,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    radios_checked: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colorPrimary
    },
    dash: {
        height: 1,
        backgroundColor: colorDisable,
        position: 'absolute',
        left: dimenScreenPaddingHorizontal,
        right: dimenScreenPaddingHorizontal,
        bottom: dimenScreenPaddingBottom,
    },
    button_skip: {
        height: dimenScreenPaddingBottom,
        position: 'absolute',
        left: 0,
        bottom: 0,
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_skip_text: {
        fontFamily: fontBold,
        fontSize: 16,
        color: colorPrimary,
        paddingBottom: 10,
    }
});