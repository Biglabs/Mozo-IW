import React from "react";
import {Alert, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {Button, ScreenFooterActions, Text} from "../../components";
import Constant from "../../../helpers/Constants";
import AsyncStorage from '../../../helpers/AsyncStorageUtils';
import { strings } from '../../../helpers/i18nUtils';
import {
    colorBorder,
    colorDisable,
    colorPrimary,
    colorScreenBackground,
    dimenScreenPaddingBottom,
    dimenScreenPaddingHorizontal,
    fontBold,
    styleScreenExplainText,
    styleScreenSubTitleText,
    styleScreenTitleText,
    styleWarningText
} from '../../../res';

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

export default class BackupPhraseConfirmScreen extends React.Component {

    constructor(props) {
        super(props);
        this.arrayOfWords = props.phrase.split(" ");
        this.shuffledArrayOfWord = shuffleArray(this.arrayOfWords.slice(0));

        this.randomWordIndex = Math.floor(Math.random() * (12 - 4 + 1)) + 4;

        this.state = {
            answerWord: this.arrayOfWords[this.randomWordIndex - 1],
            confirmWord: '',
        };
    }

    onWordClicked(word) {
        this.setState({
            confirmWord: word,
        });
    }

    onContinueClicked = () => {
        if (this.state.answerWord.toUpperCase() === this.state.confirmWord.toUpperCase()) {
            AsyncStorage.setItem(Constant.FLAG_BACKUP_WALLET, 'true');
            this.openSecurityPin();
        } else {
            Alert.alert(
                'Incorrect answer!',
                "It's important that you write your backup phrase down correctly. If something happens to your wallet, you'll need this backup_wallet to recover your money.\nPlease review your backup_wallet and try again.",
                [{text: 'OK'},],
                {cancelable: false}
            )
        }
    };

    openSecurityPin() {
        Actions.security_pin({isNewPIN: true, importedPhrase: this.props.phrase, coinTypes: this.props.coinTypes});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styleScreenTitleText}>{strings('backup_phrase_confirm.lbTitle')}</Text>
                <Text style={styleScreenSubTitleText}>
                    {strings('backup_phrase_confirm.lbTitle', this.randomWordIndex)}
                </Text>

                <View style={[styles.word_display_container, styles.phrase_confirm_container]}>
                    <View style={styles.phrase_confirm_answer_container}>
                        {
                            (this.state.confirmWord || '').length > 0 &&
                            <Button
                                type='solid'
                                title={this.state.confirmWord}
                                enabled={false}
                                textStyle={styles.button_confirm_word_text}/>
                        }
                    </View>

                    <Text style={styles.phrase_confirm_explain_text}>{strings('backup_phrase_confirm.lbPleaseTap')}</Text>

                    <ScrollView
                        style={styles.phrase_confirm_words}
                        contentContainerStyle={styles.phrase_confirm_words_content}>
                        {
                            this.shuffledArrayOfWord.map(word => {
                                let isSelected = word.toUpperCase() === this.state.confirmWord.toUpperCase();
                                return <Button key={word}
                                               title={word}
                                               type='border-primary'
                                               style={{padding: 5}}
                                               textStyle={isSelected ? styles.item_confirm_word_hidden : styles.item_confirm_word}
                                               enabled={!isSelected}
                                               onPress={() => this.onWordClicked(word)}/>
                            })
                        }
                    </ScrollView>
                </View>

                <ScreenFooterActions
                    enabledContinue={(this.state.confirmWord || '').length > 0}
                    onBackPress={() => Actions.pop()}
                    onContinuePress={this.onContinueClicked}/>
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
    phrase_confirm_container: {
        top: 150,
        bottom: dimenScreenPaddingBottom,
    },
    phrase_confirm_answer_container: {
        width: '100%',
        height: 150,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: colorBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    phrase_confirm_explain_text: {
        marginTop: 24,
        marginLeft: dimenScreenPaddingHorizontal,
        marginRight: dimenScreenPaddingHorizontal,
    },
    phrase_confirm_words: {
        width: '100%',
        flex: 1,
        marginTop: 15,
    },
    phrase_confirm_words_content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 15,
    },
    item_confirm_word: {
        paddingLeft: 8,
        paddingTop: 5,
        paddingRight: 8,
        paddingBottom: 7,
    },
    item_confirm_word_hidden: {
        borderColor: 'transparent',
        color: 'transparent',
        paddingLeft: 8,
        paddingTop: 5,
        paddingRight: 8,
        paddingBottom: 7,
    },
    dash: {
        height: 1,
        backgroundColor: colorDisable,
        position: 'absolute',
        left: dimenScreenPaddingHorizontal,
        right: dimenScreenPaddingHorizontal,
        bottom: dimenScreenPaddingBottom,
    },
    button_confirm_word_text: {
        color: '#ffffff',
        fontFamily: fontBold,
    },
});