import React, {Component} from "react";
import {Alert, Linking, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import {Actions} from 'react-native-router-flux';
import {Button, NavigationBar, Text} from "../../components/SoloComponent";

import bip39 from 'bip39';
import Transaction from 'ethereumjs-tx';
import Web3 from 'web3';
import Bitcoin from "react-native-bitcoinjs-lib";
import DataManager from '../../utils/DataManager';
import Globals from '../../common/Globals';
import WalletManager from '../../utils/WalletManager';

export default class ConfirmationScreen extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            pressedConfirm: false,
            isShowingLoading: false
        };
    }

    onConfirmTransaction() {
        this.setState({isShowingLoading: true}, () => {
            setTimeout(() => {
                WalletManager.signTransaction(this.props.txData, this.props.pin, (error, result) => {
                    if (result) {
                        Actions.pop();
                        Globals.responseToReceiver({signedTransaction : result}, this.props.txData);
                    } else {
                        this.state.isShowingLoading = false;
                        alert(error);
                    }
                });
            }, 5);
        });
    }

    render() {
        if (this.state.isShowingLoading)
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large" color="#ffffff" animating={this.state.isShowingLoading}/>
                </View>
            );
        else
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='Send Confirmation'
                    backgroundColor={StyleSheet.value('$primaryColor')}
                    accentColor='#ffffff'/>

                <View style={styles.content}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                        <SvgUri
                            fill={StyleSheet.value('$primaryColor')}
                            width={15}
                            height={15}
                            source={require('../../res/icons/ic_send.svg')}/>
                        <Text style={styles.text_send}>Send</Text>
                    </View>
                    <Text style={styles.text_value}>
                        {this.props.txData.params.value} {(this.props.txData.coinType || '').toUpperCase()}
                    </Text>
                    <Text style={styles.text_usd}>... USD</Text>

                    <View style={styles.dash}/>

                    <Text>
                        <Text style={styles.text_section}>Mining Fee: </Text>
                        <Text style={[styles.text_section, styles.text_mining_fee_value]}>... BTC</Text>
                    </Text>

                    <View style={styles.dash}/>

                    <Text style={styles.text_section}>To:</Text>
                    <Text style={styles.text_address} numberOfLines={1}
                          ellipsizeMode='middle'>{this.props.txData.params.to}</Text>

                    <View style={styles.dash}/>

                    <Text style={styles.text_section}>From:</Text>
                    <Text style={styles.text_address} numberOfLines={1}
                          ellipsizeMode='middle'>{this.props.txData.params.from}</Text>

                    <View style={styles.dash}/>

                    {
                        this.state.pressedConfirm &&
                        <View style={styles.confirmation_container}>

                            <Text style={styles.confirmation_text}>Hold 5s to confirm send transaction</Text>
                        </View>
                    }
                    <TouchableOpacity style={styles.button_confirm}
                                      onPressIn={() => this.setState({pressedConfirm: true})}
                                      onPressOut={() => {
                                          this.setState({pressedConfirm: false});
                                          this.onConfirmTransaction();
                                      }}>
                        <SvgUri
                            fill={StyleSheet.value('$primaryColor')}
                            width={33}
                            height={33}
                            source={require('../../res/icons/ic_check.svg')}/>
                        <Text style={styles.text_confirm}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loading_container: {
        backgroundColor: '$primaryColor',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    oading_container: {
        backgroundColor: '$primaryColor',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        alignItems: 'flex-start',
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '$screen_padding_horizontal'
    },
    dash: {
        height: 1,
        backgroundColor: '$disableColor',
        marginTop: 20,
        marginBottom: 15
    },
    text_send: {
        color: '$textContentColor',
        fontSize: 16,
        marginLeft: 12
    },
    text_value: {
        color: '$primaryColor',
        fontSize: 25
    },
    text_usd: {
        color: '#c1c1c1',
        fontSize: 14
    },
    text_section: {
        color: '$textTitleColor',
        fontSize: 14,
        fontFamily: '$primaryFontBold'
    },
    text_mining_fee_value: {
        fontFamily: '$primaryFont'
    },
    text_address: {
        color: '#969696',
        fontSize: 12
    },
    text_confirm: {
        color: '$textTitleColor',
        fontSize: 16,
        fontFamily: '$primaryFontBold',
        marginLeft: 6,
    },
    button_confirm: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: '36%',
        right: '36%',
        marginBottom: 20,
    },
    confirmation_container: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    confirmation_text: {
        color: '#5a9cf5',
        fontSize: 12
    }
});