import React from "react";
import {ActivityIndicator, Alert, Linking, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import {Actions} from 'react-native-router-flux';
import {ScreenHeaderActions, Text} from "../../components";
import Globals from '../../common/Globals';
import WalletManager from '../../utils/WalletManager';
import {icCheck, icSend} from '../../res/icons';

export default class ConfirmationScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pressedConfirm: false,
            isShowingLoading: false
        };

        this.value = 0;
        if (this.props.txData.params.value) this.value = this.props.txData.params.value;
        else {
            this.props.txData.params.outputs.map(item => this.value += item.value);
        }

        this.toAddress = [];
        if (this.props.txData.params.to) this.toAddress.push(this.props.txData.params.to);
        else {
            this.props.txData.params.outputs.map(out => {
                out.addresses.map(address => this.toAddress.push(address));
            });
        }

        this.fromAddress = [];
        if (this.props.txData.params.from) this.fromAddress.push(this.props.txData.params.from);
        else {
            this.props.txData.params.inputs.map(inp => {
                inp.addresses.map(address => this.fromAddress.push(address));
            });
        }
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
                    <ScreenHeaderActions
                        title='Send Confirmation'
                        backgroundColor={StyleSheet.value('$primaryColor')}
                        accentColor='#ffffff'/>

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
                            <Text style={styles.text_section}>Mining Fee: </Text>
                            <Text style={[styles.text_section, styles.text_mining_fee_value]}>... BTC</Text>
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
        height: '$screen_padding_bottom',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: '36%',
        right: '36%',
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