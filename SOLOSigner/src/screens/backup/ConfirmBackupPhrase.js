import React from "react";
import {Alert, AsyncStorage, ScrollView, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button, ScreenFooterActions, Text} from "../../components";
import Bip39 from 'bip39';
import Constant from "../../common/Constants";

const phraseLanguage = Bip39.wordlists.english;
const phraseLength = 12; //[12 ... 24]
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

export default class ConfirmBackupPhrase extends React.Component {

    constructor(props) {
        super(props);
        this.phrase = Bip39.generateMnemonic(phraseLength * 32 / 3, null, phraseLanguage);
        this.arrayOfWords = this.phrase.split(" ");
        this.shuffledArrayOfWord = shuffleArray(this.arrayOfWords.slice(0));

        this.randomWordIndex = Math.floor(Math.random() * (12 - 4 + 1)) + 4;

        this.state = {
            isUserHasRead: false,
            isConfirmingStep: false,
            answerWord: this.arrayOfWords[this.randomWordIndex - 1],
            confirmWord: '',
        };
    }

    onWordClicked(word) {
        this.setState({
            confirmWord: word,
        });
    }

    onBackClicked() {
        this.setState({
            isConfirmingStep: false,
            confirmWord: ''
        });
    }

    onContinueClicked() {
        if (this.state.isConfirmingStep) {
            if (this.state.answerWord.toUpperCase() === this.state.confirmWord.toUpperCase()) {
                AsyncStorage.setItem(Constant.FLAG_BACKUP_WALLET, 'true');
                this.openSecurityPin();
            } else {
                Alert.alert(
                    'Incorrect answer!',
                    "It's important that you write your backup phrase down correctly. If something happens to your wallet, you'll need this backup to recover your money.\nPlease review your backup and try again.",
                    [{text: 'OK'},],
                    {cancelable: false}
                )
            }
        } else {
            this.shuffledArrayOfWord = shuffleArray(this.arrayOfWords.slice(0));
            this.setState({isConfirmingStep: true});
        }
    }

    openSecurityPin() {
        Actions.security_pin({isNewPIN: true, importedPhrase: this.phrase, coinTypes: this.props.coinTypes});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={StyleSheet.value('$screen_title_text')}>Backup Phrase</Text>
                <Text
                    style={StyleSheet.value(this.state.isConfirmingStep ? '$screen_sub_title_text' : '$screen_explain_text')}>
                    {
                        this.state.isConfirmingStep
                            ? `Which one is ${this.randomWordIndex}th backup phrase?`
                            : 'Please write it down on a paper and keep it in a safe place as you would with paper money'
                    }
                </Text>

                {
                    !this.state.isConfirmingStep &&
                    <Text style={[
                        StyleSheet.value('$warning_text'),
                        {marginTop: 10}
                    ]}>
                        If you lose your recovery phase, your wallet cannot be recovered.
                    </Text>
                }

                {
                    !this.state.isConfirmingStep &&
                    <View style={[styles.word_display_container, styles.phrase_container]}>
                        {
                            this.arrayOfWords.map(word => {
                                return <Text key={word} style={styles.item_word}>{word}</Text>
                            })
                        }
                    </View>
                }

                {
                    this.state.isConfirmingStep &&
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

                        <Text style={styles.phrase_confirm_explain_text}>Please tap each word in the correct
                            order.</Text>

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
                }

                {
                    !this.state.isConfirmingStep &&
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
                }
                {
                    !this.state.isConfirmingStep &&
                    <View style={styles.dash}/>
                }

                <ScreenFooterActions
                    enabledContinue={
                        (this.state.isUserHasRead && !this.state.isConfirmingStep) ||
                        (this.state.isConfirmingStep && (this.state.confirmWord || '').length > 0)
                    }
                    onBackPress={this.state.isConfirmingStep ? () => this.onBackClicked() : null}
                    onContinuePress={() => this.onContinueClicked()}/>

                {
                    !this.state.isConfirmingStep &&
                    <TouchableOpacity
                        style={styles.button_skip}
                        onPress={() => this.openSecurityPin()}>
                        <Text style={styles.button_skip_text}>Skip</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal'
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
        borderColor: '$borderColor',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 50,
        paddingTop: 20,
        paddingRight: 50,
        paddingBottom: 22,
        top: 225,
    },
    phrase_confirm_container: {
        top: 150,
        bottom: '$screen_padding_bottom',
    },
    phrase_confirm_answer_container: {
        width: '100%',
        height: 150,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '$borderColor',
        alignItems: 'center',
        justifyContent: 'center',
    },
    phrase_confirm_explain_text: {
        marginTop: 24,
        marginLeft: '$screen_padding_horizontal',
        marginRight: '$screen_padding_horizontal',
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
    item_word: {
        color: '$primaryColor',
        fontFamily: '$primaryFontBold',
        fontSize: 14,
        padding: 5,
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
    radio_user_confirm: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: '$screen_padding_horizontal',
        right: '$screen_padding_horizontal',
        bottom: 90,
    },
    radio_user_confirm_text: {
        fontFamily: '$primaryFontBold',
        fontSize: 14
    },
    radios: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: '$borderColor',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    radios_checked: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '$primaryColor'
    },
    dash: {
        height: 1,
        backgroundColor: '$disableColor',
        position: 'absolute',
        left: '$screen_padding_horizontal',
        right: '$screen_padding_horizontal',
        bottom: '$screen_padding_bottom',
    },
    button_confirm_word_text: {
        color: '#ffffff',
        fontFamily: '$primaryFontBold',
    },
    button_skip: {
        height: '$screen_padding_bottom',
        position: 'absolute',
        left: 0,
        bottom: 0,
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_skip_text: {
        fontFamily: '$primaryFontBold',
        fontSize: 16,
        color: '$primaryColor',
        paddingBottom: 10,
    }
});