import React from "react";
import {TouchableOpacity, Image, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import {FooterActions, NavigationBar, Text} from "../../components/SoloComponent";
import WalletManager from '../../utils/WalletManager';
import {Actions} from "react-native-router-flux";
import QRCode from 'react-native-qrcode';

export default class ViewBackupPhrase extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            countDownDuration: 5,
            userConfirmed: false,
        };

        WalletManager.viewBackupPharse(this.props.pin, (error, result) => {
            this.backupPhrase = result;
            this.arrayOfWords = result.split(" ");
        });

        this.countDownHandler = () => {
            if (Actions.currentScene === 'view_backup_phrase') {
                this.setState({
                    countDownDuration: --this.state.countDownDuration
                }, () => this.startTimerCountDown());
            }
        };
    }

    componentDidMount() {
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
                <NavigationBar title='View Backup Phrase'/>

                {
                    !this.state.userConfirmed &&
                    <View style={styles.state_container}>
                        <View style={styles.warning_text}>
                            <SvgUri width={20}
                                    height={20}
                                    source={require('../../res/icons/ic_warning.svg')}
                                    style={{marginRight: 6}}/>
                            <Text style={[StyleSheet.value('$warning_text'), {paddingBottom: 5}]}>WARNING</Text>
                        </View>

                        <Text style={styles.explain_text}>
                            Your Backup Phrase will be displayed as both a QR code and a string of random words.
                            {'\n\n'}
                            Make sure you view your Backup Phrase in private. Anyone with the following QR code and
                            Backup
                            Phrase can gain full access to your funds so DO NOT store them publicly or share with
                            anyone.
                        </Text>
                    </View>
                }

                {
                    this.state.countDownDuration > 0 &&
                    <Text style={styles.count_down_text}>{this.state.countDownDuration}</Text>
                }
                {
                    !this.state.userConfirmed &&
                    <FooterActions
                        rightButtonText='I understand'
                        onBackPress={() => Actions.pop()}
                        enabledContinue={this.state.countDownDuration === 0}
                        onContinuePress={() => this.setState({userConfirmed: true})}/>
                }

                {
                    this.state.userConfirmed &&
                    <View style={styles.state_container}>
                        <Text style={[styles.explain_text, styles.explain_qr_code_text]}>
                            Scan this QR Code with the camera of the device you wish to pair to, or enter the Backup
                            Phrase below.</Text>

                        <View style={styles.image_qr_code}>
                            <QRCode
                                value={this.backupPhrase}
                                size={120}
                                bgColor={'#000'}
                                fgColor={'#FFF'}
                            />
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
                            <SvgUri width={18}
                                    height={18}
                                    fill={StyleSheet.value('$primaryColor')}
                                    source={require('../../res/icons/ic_cancel.svg')}
                                    style={{marginRight: 4}}/>
                            <Text style={styles.button_cancel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '$screenBackground',
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
        marginTop: 40,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    explain_text: {
        color: '$textTitleColor',
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
        backgroundColor: '$screenBackground',
        justifyContent: 'center',
        alignItems: 'center',
    },
    count_down_text: {
        fontSize: 16,
        color: '$primaryColor',
        position: 'absolute',
        bottom: 30,
    },
    item_word: {
        color: '$primaryColor',
        fontFamily: '$primaryFontBold',
        fontSize: 14,
        padding: 5,
    },
    phrase_container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '$borderColor',
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
        color: '$textTitleColor',
        fontSize: 16,
        fontFamily: '$primaryFontBold'
    }
});