import React, {Component} from "react";
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {CoinItemView, FooterActions, Text} from "../../components/SoloComponent";
import {inject, observer} from "mobx-react";

@inject("selectedWalletsStore")
@observer
export default class AddWalletScreen extends Component {
    render() {
        let selectedWallets = this.props.selectedWalletsStore.wallets;
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

                <FooterActions
                    enabledContinue={selectedWallets.length > 0}
                    onBackPress={() => Actions.pop()}
                    onContinuePress={() => {
                        Actions.confirm_backup_phrase({coinTypes: selectedWallets});
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
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal'
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