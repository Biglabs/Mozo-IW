import React, {Component} from "react";
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {Actions} from 'react-native-router-flux';
import {inject} from "mobx-react";

import {CoinItemView, ScreenHeaderActions, Text, TextInput} from "../../components";
import Constant from '../../../helpers/Constants';
import {
    colorDisable,
    colorPrimary,
    colorScreenBackground,
    dimenCornerRadius,
    dimenScreenPaddingBottom,
    dimenScreenPaddingHorizontal,
    fontBold,
    icons
} from '../../../res';

@inject("selectedWalletsStore")
export default class AddMoreWalletScreen extends Component {

    constructor(props) {
        super(props);

        const getCoinIdentifierKey = function (coin) {
            return coin.displayName.replace(" ", "_").concat(coin.value).concat(coin.network).toLowerCase()
        };

        this.selectedWallets = this.props.selectedWalletsStore.wallets;

        this.wallets = [];
        Object.keys(Constant.COIN_TYPE).map(key => {
            let coin = Constant.COIN_TYPE[key];
            coin.identifierKey = getCoinIdentifierKey(coin);

            let coinIndex = this.selectedWallets.findIndex(item => {
                item.identifierKey = getCoinIdentifierKey(item);
                return coin.identifierKey === item.identifierKey
            });

            coin.selected = coinIndex >= 0;
            this.wallets.push(coin);
        });

        this.state = {
            wallets: this.wallets,
            selectedWallets: this.selectedWallets,
        }
    }

    onItemCoinClick = key => {
        let coinIndex = this.wallets.findIndex(item => {
            return item.identifierKey === key
        });
        if (coinIndex >= 0) {
            const coin = this.wallets[coinIndex];
            coin.selected = !coin.selected;

            let selectedCoinIndex = this.selectedWallets.findIndex(item => {
                return item.identifierKey === key
            });
            if (selectedCoinIndex >= 0) {
                this.selectedWallets.splice(selectedCoinIndex, 1);
            } else {
                this.selectedWallets.push(coin);
            }
        }

        this.setState({
            wallets: this.getSearchResult(),
            selectedWallets: this.selectedWallets
        });
    };

    onAddClicked() {
        this.props.selectedWalletsStore.updateWallets(this.state.selectedWallets);
        Actions.pop();
    }

    doSearchWallet() {
        this.setState({
            wallets: this.getSearchResult(),
        });
    }

    getSearchResult() {
        let keyword = this.searchKeyword || '';
        return this.wallets.filter(item => item.displayName.toLowerCase().includes(keyword.toLowerCase()));
    }

    render() {
        let hasWalletSelected = this.state.selectedWallets.length > 0;
        let buttonAddTextColor = hasWalletSelected ? colorPrimary : colorDisable;
        return (
            <View style={styles.container}>
                <ScreenHeaderActions title='Add More Wallet'/>

                <View style={styles.search_box}>
                    <TextInput
                        style={styles.search_input}
                        placeholder='Search for wallet you want'
                        multiline={false}
                        numberOfLines={1}
                        returnKeyType='search'
                        onChangeText={(text) => {
                            this.searchKeyword = text;
                            this.doSearchWallet();
                        }}
                        onSubmitEditing={() => this.doSearchWallet()}
                    />

                    <SvgUri
                        width={24}
                        height={24}
                        svgXmlData={icons.icSearch}
                        style={{
                            position: 'absolute',
                            right: 0,
                            margin: 10.5
                        }}/>
                </View>

                <FlatList
                    style={styles.coin_list}
                    data={this.state.wallets}
                    extraData={this.state.wallets.length + this.state.selectedWallets.length}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    renderItem={({item}) =>
                        <CoinItemView
                            id={item.identifierKey}
                            icon={item.icon}
                            label={item.displayName}
                            checked={item.selected || false}
                            onItemClicked={item.isDefault ? null : this.onItemCoinClick}/>
                    }
                />

                <TouchableOpacity
                    disabled={!hasWalletSelected}
                    style={styles.button_add}
                    onPress={() => this.onAddClicked()}>
                    <Text style={[styles.button_add_text, {color: buttonAddTextColor}]}>
                        Add
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colorScreenBackground,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    search_box: {
        width: '84%',
        height: 45,
        backgroundColor: '#f6f6f6',
        borderRadius: dimenCornerRadius,
        marginLeft: dimenScreenPaddingHorizontal,
        marginTop: 20,
        marginRight: dimenScreenPaddingHorizontal,
    },
    search_input: {
        width: '100%',
        height: '100%',
        paddingLeft: 15,
        paddingRight: 45,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 0
    },
    coin_list: {
        width: '84%',
        flex: 1,
        marginLeft: dimenScreenPaddingHorizontal,
        marginTop: 20,
        marginRight: dimenScreenPaddingHorizontal,
        marginBottom: dimenScreenPaddingBottom
    },
    button_add: {
        paddingLeft: 30,
        paddingTop: 26,
        paddingRight: 30,
        paddingBottom: 26,
        bottom: 0,
        right: 0,
        position: 'absolute'
    },
    button_add_text: {
        color: colorPrimary,
        fontFamily: fontBold,
        fontSize: 16
    }
});