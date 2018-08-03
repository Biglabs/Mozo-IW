import React, {Component} from "react";
import {Alert, ActivityIndicator, StyleSheet, TouchableHighlight, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {ScreenFooterActions, Text} from "../components";
// import WalletManager from '../../services/WalletService';
import { walletService } from "../../services/index.js";



import {colorPrimary, colorScreenBackground, dimenScreenPaddingBottom, styleScreenTitleText} from '../../res';

const accentColor = '#00fffc';
const numbersPressedColor = '#003c8d';
const numberPad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['CLR', 0, 'DEL']
];
const PIN_LENGTH = 6;
const inputNewPIN = "Create a new PIN";
const inputConfirmPIN = "Confirm PIN";
const inputExistingPIN = "Enter PIN";

export default class SecurityPinScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.pinCode = Array.apply(null, Array(PIN_LENGTH));
        this.pinCodeConfirm = Array.apply(null, Array(PIN_LENGTH));
        this.state = {
            pinIndex: -1,
            isShowingLoading: false,
            title: inputExistingPIN,
            isConfirm: false
        };
        if (this.props.isNewPIN) {
            this.state.title = inputNewPIN;
        }
    }

    handleContinuePress() {
        if (this.props.isNewPIN) {
            if (this.state.isConfirm) {
                if (this.pinCode.toString() === this.pinCodeConfirm.toString()) {
                    this.handleEnterCorrectPin();
                } else {
                    Alert.alert(
                        'Error',
                        'Confirm PIN does not match!',
                        [{text: 'OK'},],
                    );
                    this.clearPin();
                }
            } else {
                this.pinCodeConfirm = this.pinCode;
                this.state.isConfirm = true;
                this.state.title = inputConfirmPIN;
                this.clearPin();
            }
        } else {
            this.handleEnterCorrectPin();
        }
    }

    handleEnterCorrectPin() {
        let me = this;
        this.setState({isShowingLoading: true}, () => {
            setTimeout(() => {
                /* let pin = JSON.stringify(this.pinCode);
                WalletManager.manageWallet(this.props.isNewPIN, pin, this.props.importedPhrase, this.props.coinTypes, (error, result) => {
                    //Check error type
                    console.log("handleEnterCorrectPin, error: ", error);
                    this.props.isNewPIN = false;
                    // Open Home Screen
                    let pin = JSON.stringify(this.pinCode);
                    Actions.home({pin: pin});
                }); */
                /** Code for testing */
                let pin = JSON.stringify(this.pinCode);
                walletService.manageWallet(this.props.isNewPIN, pin, this.props.importedPhrase, this.props.coinTypes, (error, result) => {
                    //Check error type
                    console.log("handleEnterCorrectPin, error: ", error);
                    this.props.isNewPIN = false;
                    // Open Home Screen
                    let pin = JSON.stringify(this.pinCode);
                    Actions.home({pin: pin});
                });

                /* me.setState({
                    isShowingLoading: false
                }); */
                //console.log( "From wallet services: " + test());
                //console.log("handleEnterCorrectPin: " + square(11)); // 121
                //console.log("handleEnterCorrectPin: " + diag(4, 3)); // 5
                /** End Code for testing */
            //}, 5); // old code
            }, 1); // test code
        });
    }

    clearPin() {
        this.setState({pinIndex: -1, isShowingLoading: false}, () => {
            this.pinCode = Array.apply(null, Array(PIN_LENGTH));
        });
    }

    keyPress(key) {
        if (key === 'DEL') {
            if (this.state.pinIndex === -1) return;

            this.pinCode[this.state.pinIndex] = null;
            this.setState({pinIndex: --this.state.pinIndex});
            return;

        } else if (key === 'CLR') {
            this.clearPin();
            return;
        }

        if (this.state.pinIndex >= (this.pinCode.length - 1)) return;

        this.setState({pinIndex: ++this.state.pinIndex}, () => {
            this.pinCode[this.state.pinIndex] = key;
        });
    }

    render() {
        if (this.state.isShowingLoading)
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large" color="#ffffff" animating={this.state.isShowingLoading}/>
                    <Text style={styles.loading_text}>Creating Interface</Text>
                </View>
            );
        else
            return (
                <View style={styles.container}>

                    <Text style={[styleScreenTitleText, styles.title]}>Security Pin</Text>

                    <Text style={styles.sub_title}>{this.state.title}</Text>

                    <View style={styles.radio_container}>
                        {
                            this.pinCode.map((value, index) => {
                                return <View key={index} style={styles.radios}>
                                    {
                                        this.state.pinIndex >= index && <View style={styles.radios_checked}/>
                                    }
                                </View>
                            })
                        }
                    </View>

                    <View style={styles.number_pad}>
                        {
                            numberPad.map((row, key) => {
                                return <View key={key} style={styles.numbers_row}>
                                    {
                                        row.map(button => {
                                            return <TouchableHighlight
                                                key={button}
                                                style={styles.numbers_touch}
                                                onPress={() => this.keyPress(button)}
                                                underlayColor={numbersPressedColor}>

                                                <Text style={styles.numbers}>{button}</Text>

                                            </TouchableHighlight>
                                        })
                                    }
                                </View>
                            })
                        }
                    </View>

                    <ScreenFooterActions
                        buttonsColor={{back: accentColor, continue: accentColor}}
                        onBackPress={this.props.isNewPIN ? () => Actions.pop() : null}
                        enabledContinue={this.state.pinIndex === (this.pinCode.length - 1)}
                        onContinuePress={() => this.handleContinuePress()}/>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    loading_container: {
        backgroundColor: colorPrimary,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading_text: {
        fontSize: 14,
        color: '#ffffff',
        marginTop: 24
    },
    container: {
        alignItems: 'flex-start',
        backgroundColor: colorPrimary,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 30,
        paddingRight: 30
    },
    title: {
        width: '100%',
        textAlign: 'center',
        color: colorScreenBackground
    },
    sub_title: {
        width: '100%',
        textAlign: 'center',
        color: colorScreenBackground,
        fontSize: 14
    },
    radio_container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 12,
    },
    radios: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: accentColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
    },
    radios_checked: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: accentColor
    },
    number_pad: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: dimenScreenPaddingBottom,
    },
    numbers_row: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 7,
        marginBottom: 7,
    },
    numbers_touch: {
        width: 66,
        height: 66,
        borderRadius: 33,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    numbers: {
        color: '#429ffd',
        fontSize: 23.8,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
        paddingBottom: 2
    }
});