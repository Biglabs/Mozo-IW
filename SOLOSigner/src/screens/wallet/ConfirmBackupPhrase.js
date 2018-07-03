import React from "react";
import {TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {FooterActions, Text} from "../../components/SoloComponent";
import Bip39 from 'bip39';

const phraseLanguage = Bip39.wordlists.english;
const phraseLength = 12; //[12 ... 24]

export default class ConfirmBackupPhrase extends React.Component {

    constructor(props) {
        super(props);
        let phrase = Bip39.generateMnemonic(phraseLength * 32 / 3, null, phraseLanguage);
        this.arrayOfWords = phrase.split(" ");

        this.state = {isUserHasRead: false};
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={StyleSheet.value('$screen_title_text')}>Backup Phrase</Text>
                <Text style={StyleSheet.value('$screen_explain_text')}>
                    Please write it down on a paper and keep it in a safe place as you would with paper money
                </Text>

                <Text style={[
                    StyleSheet.value('$warning_text'),
                    {marginTop: 10}
                ]}>
                    If you lose your recovery phase, your wallet cannot be recovered.
                </Text>

                <View style={styles.phrase_container}>
                    {
                        this.arrayOfWords.map(word => {
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

                <FooterActions
                    enabledContinue={this.state.isUserHasRead}
                    onContinuePress={() => {
                        Actions.security_pin({isNewPIN: true, coinTypes: this.props.coinTypes});
                    }}/>

                <TouchableOpacity style={styles.button_skip}>
                    <Text style={styles.button_skip_text}>Skip</Text>
                </TouchableOpacity>
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
    phrase_container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 50,
        paddingTop: 20,
        paddingRight: 50,
        paddingBottom: 22,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '$borderColor',
        position: 'absolute',
        top: 225,
        left: 0,
        right: 0,
    },
    item_word: {
        color: '$primaryColor',
        fontFamily: '$primaryFontBold',
        fontSize: 14,
        padding: 5,
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