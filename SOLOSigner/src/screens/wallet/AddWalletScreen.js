import React, {Component} from "react";
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {CoinItemView, FooterActions, Text} from "../../components/SoloComponent";
import Constant from '../../common/Constants';

export default class AddWalletScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {wallets: Constant.DEFAULT_COINS};
    }

    componentWillReceiveProps() {
        if (this.props.selected) {
            this.setState({
                wallets: this.props.selected
            });
        }
    }

    addMoreWallet() {
        Actions.add_more_wallet({selected: this.state.wallets});
    }

    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>Add Wallet</Text>

                <Text style={StyleSheet.value('$screen_sub_title_text')}>
                    Please select the wallet you wish to active
                </Text>

                <Text style={
                    [
                        StyleSheet.value('$screen_explain_text'),
                        {marginTop: 10, marginBottom: 10}
                    ]}>
                    We require you to active at least one wallet. Please note that additional wallets can be activated
                    later time.
                </Text>

                <TouchableOpacity
                    style={styles.button_add_more}
                    onPress={() => this.addMoreWallet()}>
                    <Text style={styles.button_add_more_text}>+ Add more wallet</Text>
                </TouchableOpacity>

                <FlatList
                    style={styles.coin_list}
                    data={this.state.wallets}
                    extraData={this.state.wallets.length}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    renderItem={
                        ({item}) => <CoinItemView icon={item.icon} label={item.name}/>
                    }
                />

                <FooterActions
                    onBackPress={() => Actions.pop()}
                    onContinuePress={() => {
                        Actions.security_pin({isNewPIN : true, coinTypes: this.state.wallets});
                    }}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 30,
        paddingRight: 30
    },
    button_add_more: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_add_more_text: {
        color: '$primaryColor',
        fontFamily: '$primaryFontBold',
        fontSize: 14,
    },
    coin_list: {
        width: '100%',
        marginTop: 5,
        flex: 1,
        marginBottom: '$screen_padding_bottom',
    }
});