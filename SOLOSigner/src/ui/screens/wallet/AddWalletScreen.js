import React, {Component} from "react";
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {inject, observer} from "mobx-react";

import {CoinItemView, ScreenFooterActions, Text} from "../../components";
import WalletManager from '../../../services/WalletService';
import Globals from '../../../services/GlobalService';
import Constant from "../../../helpers/Constants";

import {
    colorPrimary,
    colorScreenBackground,
    dimenScreenPaddingBottom,
    dimenScreenPaddingHorizontal,
    fontBold,
    styleScreenExplainText,
    styleScreenSubTitleText,
    styleScreenTitleText,
} from '../../../res';

@inject("selectedWalletsStore")
@observer
export default class AddWalletScreen extends Component {
    handleContinuePress(selectedWallets) {
        if (this.props.txData && this.props.pin) {
            console.log("Executing communication action.");
            WalletManager.updateAddresses(selectedWallets);
            Actions.pop();
            Globals.responseToReceiver({success: true}, this.props.txData);
        } else {
            console.log("Executing create new wallet flow.");
            Actions.confirm_backup_phrase({coinTypes: selectedWallets});
        }
    }

    handleBackPress() {
        Actions.pop();
        if (this.props.txData && this.props.pin) {
            console.log("Executing communication action.");
            let error = Constant.ERROR_TYPE.CANCEL_REQUEST;
            Globals.responseToReceiver({error: error}, this.props.txData);
        } else {
            console.log("Executing create new wallet flow.");
        }
    }

    render() {
        let selectedWallets = this.props.selectedWalletsStore.wallets;
        return (
            <View style={styles.container}>

                <Text style={styleScreenTitleText}>Add Wallet</Text>

                <Text style={styleScreenSubTitleText}>
                    Please select the wallet you wish to active
                </Text>

                <Text style={
                    [
                        styleScreenExplainText,
                        {marginTop: 10, marginBottom: 10}
                    ]}>
                    We require you to active at least one wallet. Please note that additional wallets can be activated
                    later time.
                </Text>

                <TouchableOpacity
                    style={styles.button_add_more}
                    onPress={() => Actions.add_more_wallet({selectedWallets: selectedWallets})}>
                    <Text style={styles.button_add_more_text}>+ Add more wallet</Text>
                </TouchableOpacity>

                <FlatList
                    style={styles.coin_list}
                    data={selectedWallets}
                    extraData={selectedWallets.length}
                    keyExtractor={(item, index) => `${item.displayName}-${index}`}
                    renderItem={
                        ({item}) => <CoinItemView icon={item.icon} label={item.displayName}/>
                    }
                />

                <ScreenFooterActions
                    enabledContinue={selectedWallets.length > 0}
                    onBackPress={() => this.handleBackPress()}
                    onContinuePress={() => {
                        this.handleContinuePress(selectedWallets);
                    }}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: colorScreenBackground,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal
    },
    button_add_more: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_add_more_text: {
        color: colorPrimary,
        fontFamily: fontBold,
        fontSize: 14,
    },
    coin_list: {
        width: '100%',
        marginTop: 5,
        flex: 1,
        marginBottom: dimenScreenPaddingBottom,
    }
});