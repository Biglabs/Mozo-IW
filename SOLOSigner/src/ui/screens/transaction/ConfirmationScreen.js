import React from "react";
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import {Actions} from 'react-native-router-flux';
import CountDown from 'react-native-countdown-component';

import {ScreenHeaderActions, Text} from "../../components";
import Globals from '../../../services/GlobalService';
import Constant from '../../../helpers/Constants';
import WalletManager from '../../../services/WalletService';
import {icCheck, icSend} from '../../../res/icons';

export default class ConfirmationScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pressedConfirm: false,
            isShowingLoading: false
        };

        this.toAddress = [];
        this.props.txData.params.tx.outputs.map(out => {
            out.addresses.map(address => this.toAddress.push(address));
        });

        this.fromAddress = [];
        this.props.txData.params.tx.inputs.map(inp => {
            inp.addresses.map(address => this.fromAddress.push(address));
        });

        this.value = 0;
        this.props.txData.params.tx.outputs.map(item => {
            // Do not add return money
            // BlockCypher will set the change address to the first transaction input/address listed in the transaction. 
            // To redirect this default behavior, you can set an optional change_address field within the TX request object.
            if(item.addresses[0] != this.fromAddress[0]){
                this.value += item.value;
            }
        });
        if (this.value > 0) {
            this.value /= (this.props.txData.coinType == Constant.COIN_TYPE.BTC.name ? Constant.SATOSHI_UNIT : Constant.WEI_UNIT);
        }

        this.fees = this.props.txData.params.tx.fees / (this.props.txData.coinType == Constant.COIN_TYPE.BTC.name ? Constant.SATOSHI_UNIT : Constant.WEI_UNIT);

        this.confirmTimeout = Constant.CONFIRM_TIME_OUT;
    }

    onConfirmTransaction() {
        this.setState({isShowingLoading: true}, () => {
            setTimeout(() => {
                WalletManager.signTransaction(this.props.txData, this.props.pin, (error, result) => {
                    if (result) {
                        Actions.pop();
                        Globals.responseToReceiver({signedTransaction: result}, this.props.txData);
                    } else {
                        this.setState({isShowingLoading: false});
                        console.log(error.message || error.detail);
                    }
                });
            }, 5);
        });
    }

    cancelTransaction() {
        Actions.pop();
        Globals.responseToReceiver({error: Constant.ERROR_TYPE.CANCEL_REQUEST}, this.props.txData);
    }

    handleConfirmTimeout() {
        Alert.alert(
            'Transaction confirmation timeout',
            'This transaction has been time out. Please try again.',
            [
                {text: 'OK', onPress: () => {
                    this.cancelTransaction();
                }},
            ],
            { cancelable: false }
        );
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
                    <ScreenHeaderActions
                        title='Send Confirmation'
                        backgroundColor={StyleSheet.value('$primaryColor')}
                        accentColor='#ffffff'
                        onBackPress={() => {
                            this.cancelTransaction();
                        }}
                        />

                    <View style={styles.content}>
                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                            <SvgUri
                                fill={StyleSheet.value('$primaryColor')}
                                width={15}
                                height={15}
                                svgXmlData={icSend}/>
                            <Text style={styles.text_send}>Send</Text>
                        </View>
                        <Text style={styles.text_value}>
                            {this.value} {(this.props.txData.coinType || '').toUpperCase()}
                        </Text>
                        <Text style={styles.text_usd}>... USD</Text>

                        <View style={styles.dash}/>

                        <Text>
                            <Text style={styles.text_section}>Mining Fee: {this.fees}</Text>
                            <Text style={[styles.text_section, styles.text_mining_fee_value]}> {this.props.txData.coinType}</Text>
                        </Text>

                        <View style={styles.dash}/>

                        <Text style={styles.text_section}>To:</Text>

                        {
                            this.toAddress.map(address => {
                                return <Text key={address} style={styles.text_address} numberOfLines={1}
                                             ellipsizeMode='middle'>{address}</Text>
                            })
                        }

                        <View style={styles.dash}/>

                        <Text style={styles.text_section}>From:</Text>
                        {
                            this.fromAddress.map(address => {
                                return <Text key={address} style={styles.text_address} numberOfLines={1}
                                             ellipsizeMode='middle'>{address}</Text>
                            })
                        }
                        <View style={styles.dash}/>

                        {
                            this.state.pressedConfirm &&
                            <View style={styles.confirmation_container}>

                                <Text style={styles.confirmation_text}>Hold 5s to confirm send transaction</Text>
                            </View>
                        }
                        <View style={styles.confirmation_footer}>
                            <CountDown
                                style={styles.countdown_confirm}
                                digitBgColor={StyleSheet.value('$primaryColor')}
                                digitTxtColor={StyleSheet.value('$screenBackground')}
                                timeTxtColor={StyleSheet.value('$primaryColor')}
                                until={this.confirmTimeout}
                                onFinish={() => this.handleConfirmTimeout()}
                                size={20}
                                timeToShow={['M', 'S']}
                            />
                            <TouchableOpacity style={styles.button_confirm}
                                            onPressIn={() => this.setState({pressedConfirm: true})}
                                            onPressOut={() => {
                                                this.setState({pressedConfirm: false});
                                                this.onConfirmTransaction();
                                            }}>
                                <SvgUri
                                    fill={StyleSheet.value('$primaryColor')}
                                    width={20}
                                    height={20}
                                    svgXmlData={icCheck}/>
                                <Text style={styles.text_confirm}>Confirm</Text>
                            </TouchableOpacity>
                            <Text style={styles.text_reject} onPress={() => {
                                            this.cancelTransaction();
                                        }}>Reject</Text>
                        </View>
                        
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
    container: {
        alignItems: 'flex-start',
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    confirmation_footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
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
    text_reject: {
        color: '$errorColor',
        fontSize: 14,
        position: 'absolute',
        right: 0,
        bottom: 0,
        paddingBottom: 27,
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
    countdown_confirm: {
        marginBottom: 100
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