import React, {Component} from "react";
import {FlatList, StyleSheet, TouchableOpacity, View, AppState} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {inject, observer} from "mobx-react";

import {CoinItemView, ScreenFooterActions, Text} from "../../components";
import WalletManager from '../../../services/WalletService';
import Globals from '../../../services/GlobalService';
import Constant from "../../../helpers/Constants";
import { strings } from '../../../helpers/i18nUtils';

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
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        this.isManageMode = this.props.txData && this.props.pin;
        this.getInitialWallets();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    getInitialWallets() {
        if (this.isManageMode) {
            let inUseCoinTypes = WalletManager.loadInUseCoinTypes();
            this.props.selectedWalletsStore.updateWallets(inUseCoinTypes);
        }
    }

    handleContinuePress(selectedWallets) {
        if (this.isManageMode) {
            console.log("Executing communication action.");
            WalletManager.updateAddresses(selectedWallets);
            Actions.pop();
            Globals.responseToReceiver({success: true}, this.props.txData);
        } else {
            console.log("Executing create new wallet flow.");
            Actions.backup_phrase_display({coinTypes: selectedWallets});
        }
    }

    handleBackPress() {
        Actions.pop();
        if (this.isManageMode) {
            console.log("Executing communication action.");
            let error = Constant.ERROR_TYPE.CANCEL_REQUEST;
            Globals.responseToReceiver({error: error}, this.props.txData);
        } else {
            console.log("Executing create new wallet flow.");
        }
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState !== 'active') {
            console.log('App has come to the background!');
            Actions.pop();
        }
    };

    render() {
        let selectedWallets = this.props.selectedWalletsStore.wallets;
        return (
            <View style={styles.container}>
                <Text style={styleScreenTitleText}>{strings('add_wallet.lbTitle')}</Text>

                <Text style={styleScreenSubTitleText}>
                    {strings('add_wallet.lbPlease')}
                </Text>

                <Text style={
                    [
                        styleScreenExplainText,
                        {marginTop: 10, marginBottom: 10}
                    ]}>
                    {strings('add_wallet.lbWe')}
                </Text>

                <TouchableOpacity
                    style={styles.button_add_more}
                    onPress={() => Actions.add_more_wallet()}>
                    <Text style={styles.button_add_more_text}>+ {strings('add_wallet.btnAddMore')}</Text>
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
