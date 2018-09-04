import React from "react";
import {ActivityIndicator, Alert, AppState, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
// import CountDown from 'react-native-countdown-component';

import {
    colorContentText,
    colorDisable,
    colorError,
    colorPrimary,
    colorScreenBackground,
    colorTitleText,
    dimenScreenPaddingBottom,
    dimenScreenPaddingHorizontal,
    fontBold,
    fontRegular,
    icons
} from '../../../res';
import {ScreenHeaderActions, SvgView, Text} from "../../components";
import Constant from '../../../helpers/Constants';
import Globals from '../../../services/GlobalService';
import SignService from '../../../services/SignService';

export default class ConfirmationScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pressedConfirm: false,
            isShowingLoading: false
        };

        this.toAddress = [];
        this.fromAddress = [];
        this.value = 0;
        this.fees = 0;
        if (props.txData && props.txData.params && props.txData.params.tx) {
            props.txData.params.tx.outputs.map(out => {
                out.addresses.map(address => this.toAddress.push(address));
            });

            props.txData.params.tx.inputs.map(inp => {
                inp.addresses.map(address => this.fromAddress.push(address));
            });

            props.txData.params.tx.outputs.map(item => {
                // Do not add return money
                // BlockCypher will set the change address to the first transaction input/address listed in the transaction.
                // To redirect this default behavior, you can set an optional change_address field within the TX request object.
                if (item.addresses[0] != this.fromAddress[0]) {
                    this.value += item.value;
                }
            });
            if (this.value > 0) {
                this.value /= (props.txData.coinType == Constant.COIN_TYPE.BTC.name ? Constant.SATOSHI_UNIT : Constant.WEI_UNIT);
            }

            this.fees = props.txData.params.tx.fees / (props.txData.coinType == Constant.COIN_TYPE.BTC.name ? Constant.SATOSHI_UNIT : Constant.WEI_UNIT);
        } else {
            /* transaction param is empty, */
            // TODO: should be auto close this screen or alert error
        }
    }

    onConfirmTransaction() {
        this.setState({isShowingLoading: true}, () => {
            setTimeout(() => {
                SignService.signTransaction(this.props.txData, this.props.pin, (error, result) => {
                    if (result) {
                        Actions.pop();
                        Globals.responseToReceiver({signedTransaction: result}, this.props.txData);
                    } else {
                        this.setState({isShowingLoading: false});
                        console.log(error.message || error.detail);
                        var returnError = null;
                        if (error.message) {
                            returnError = Constant.ERROR_TYPE.UNKNOWN;
                            returnError.detail = error.message;
                        }
                        this.cancelTransaction(returnError);
                    }
                });
            }, 5);
        });
    }

    cancelTransaction(_error) {
        var error = _error;
        if (error == null) {
            // Set default error
            error = Constant.ERROR_TYPE.CANCEL_REQUEST;
        }
        Actions.pop();
        Globals.responseToReceiver({error: error}, this.props.txData);
    }

    handleConfirmTimeout() {
        Alert.alert(
            'Transaction confirmation timeout',
            'This transaction has been time out. Please try again.',
            [
                {
                    text: 'OK', onPress: () => {
                        this.cancelTransaction(Constant.ERROR_TYPE.TIME_OUT_CONFIRM);
                    }
                },
            ],
            {cancelable: false}
        );
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState !== 'active') {
            console.log('App has come to the background!');
            Actions.pop();
        }
    };

    render() {
        if (this.state.isShowingLoading)
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large" color="#ffffff" animating={this.state.isShowingLoading}/>
                </View>
            );
        else {
            let toAddressCoinType = '';
            let coin = Constant.COIN_TYPE[this.props.txData.coinType];
            if (coin) {
                toAddressCoinType = coin.icon;
            }
            return (
                <View style={styles.container}>
                    <ScreenHeaderActions
                        title='Send Confirmation'
                        backgroundColor={colorPrimary}
                        accentColor='#ffffff'
                        onBackPress={() => {
                            this.cancelTransaction();
                        }}
                    />

                    <View style={styles.content}>
                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                            <SvgView
                                fill={colorPrimary}
                                width={15}
                                height={15}
                                svg={icons.icSend}/>
                            <Text style={styles.text_send}>Send</Text>
                        </View>
                        <Text style={styles.text_value}>
                            {this.value} {(this.props.txData.coinType || '').toUpperCase()}
                        </Text>
                        <Text style={styles.text_usd}>... USD</Text>

                        <View style={styles.dash}/>

                        <Text>
                            <Text style={styles.text_section}>Mining Fee: {this.fees}</Text>
                            <Text
                                style={[styles.text_section, styles.text_mining_fee_value]}> {this.props.txData.coinType}</Text>
                        </Text>

                        <View style={styles.dash}/>

                        <Text style={styles.text_section}>To:</Text>
                        <View style={styles.address_container}>
                            <SvgView
                                width={20}
                                height={20}
                                svg={toAddressCoinType}/>
                            <View style={styles.address_container_map}>
                                {
                                    this.toAddress.map(address => {
                                        return <Text key={address} style={styles.text_address} numberOfLines={1}
                                                     ellipsizeMode='middle'>{address}</Text>
                                    })
                                }
                            </View>
                        </View>

                        <View style={styles.dash}/>

                        <Text style={styles.text_section}>From:</Text>
                        <View style={styles.address_container}>
                            <SvgView
                                fill={colorPrimary}
                                width={20}
                                height={20}
                                svg={icons.icWallet}/>
                            <View style={styles.address_container_map}>
                                {
                                    this.fromAddress.map(address => {
                                        return <Text key={address} style={styles.text_address} numberOfLines={1}
                                                     ellipsizeMode='middle'>{address}</Text>
                                    })
                                }
                            </View>
                        </View>

                        <View style={styles.dash}/>

                        {
                            this.state.pressedConfirm &&
                            <View style={styles.confirmation_container}>

                                <Text style={styles.confirmation_text}>Hold 5s to confirm send transaction</Text>
                            </View>
                        }
                        <View style={styles.confirmation_footer}>
                            {/*<CountDown*/}
                                {/*style={styles.countdown_confirm}*/}
                                {/*digitBgColor={colorPrimary}*/}
                                {/*digitTxtColor={colorScreenBackground}*/}
                                {/*timeTxtColor={colorPrimary}*/}
                                {/*until={Constant.CONFIRM_TIME_OUT}*/}
                                {/*onFinish={() => this.handleConfirmTimeout()}*/}
                                {/*size={20}*/}
                                {/*timeToShow={['M', 'S']}*/}
                            {/*/>*/}
                            <TouchableOpacity style={styles.button_confirm}
                                              onPressIn={() => this.setState({pressedConfirm: true})}
                                              onPressOut={() => {
                                                  this.setState({pressedConfirm: false});
                                                  this.onConfirmTransaction();
                                              }}>
                                <SvgView
                                    fill={colorPrimary}
                                    width={20}
                                    height={20}
                                    svg={icons.icCheck}/>
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
}

const styles = StyleSheet.create({
    loading_container: {
        backgroundColor: colorPrimary,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        alignItems: 'flex-start',
        backgroundColor: colorScreenBackground,
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
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: dimenScreenPaddingHorizontal
    },
    dash: {
        height: 1,
        backgroundColor: colorDisable,
        marginTop: 20,
        marginBottom: 15
    },
    text_send: {
        color: colorContentText,
        fontSize: 16,
        marginLeft: 12
    },
    text_value: {
        color: colorPrimary,
        fontSize: 25
    },
    text_usd: {
        color: '#c1c1c1',
        fontSize: 14
    },
    text_section: {
        color: colorTitleText,
        fontSize: 14,
        fontFamily: fontBold
    },
    text_mining_fee_value: {
        fontFamily: fontRegular
    },
    text_address: {
        color: '#969696',
        fontSize: 12
    },
    text_confirm: {
        color: colorTitleText,
        fontSize: 16,
        fontFamily: fontBold,
        marginLeft: 6,
    },
    text_reject: {
        color: colorError,
        fontSize: 14,
        position: 'absolute',
        right: 0,
        bottom: 0,
        paddingBottom: 27,
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal,
    },
    button_confirm: {
        height: dimenScreenPaddingBottom,
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
