import React, {Component} from "react";
import {FlatList, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import {Actions} from 'react-native-router-flux';
import {CoinItemView, NavigationBar, Text, TextInput} from "../../components/SoloComponent";
import Constant from '../../common/Constants';

export default class AddMoreWalletScreen extends Component {

    constructor(props) {
        super(props);

        this.selectedWallets = this.props.selected;

        this.wallets = [];
        Object.keys(Constant.COIN_TYPE).map(key => {
            let coin = Constant.COIN_TYPE[key];
            coin.selected = this.selectedWallets.includes(coin);
            this.wallets.push(coin);
        });

        this.state = {
            wallets: this.wallets,
            selectedWallets: this.selectedWallets
        }
    }

    onItemClicked(index) {
        const coin = this.wallets[index];
        this.wallets[index].selected = !coin.selected;

        if (this.selectedWallets.includes(coin)) {
            this.selectedWallets.splice(this.selectedWallets.indexOf(coin), 1);
        } else {
            this.selectedWallets.push(coin);
        }

        this.setState({
            wallets: this.wallets,
            selectedWallets: this.selectedWallets
        });
    };

    onInputSearch(text) {
        let found = this.wallets.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
        this.setState({
            wallets: found,
        });
    }

    render() {
        let hasWalletSelected = this.state.selectedWallets.length > 0;
        let buttonAddTextColor = StyleSheet.value(hasWalletSelected ? '$primaryColor' : '$disableColor');
        return (
            <View style={styles.container}>
                <NavigationBar title='Add More Wallet'/>

                <View style={styles.search_box}>
                    <TextInput
                        style={styles.search_input}
                        placeholder='Search for wallet you want'
                        multiline={false}
                        numberOfLines={1}
                        returnKeyType='search'
                        onChangeText={text => this.onInputSearch(text)}
                        onSubmitEditing={text => this.onInputSearch(text)}
                    />

                    <SvgUri
                        width={24}
                        height={24}
                        source={require('../../res/icons/ic_search.svg')}
                        style={{
                            position: 'absolute',
                            right: 0,
                            margin: 10.5
                        }}/>
                </View>

                <FlatList
                    style={styles.coin_list}
                    data={this.state.wallets}
                    extraData={this.state.selectedWallets.length}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    renderItem={({item, index}) =>
                        <CoinItemView
                            id={index}
                            icon={item.icon}
                            label={item.name}
                            checked={item.selected || false}
                            onItemClicked={(index) => this.onItemClicked(index)}/>
                    }
                />

                <TouchableOpacity
                    disabled={!hasWalletSelected}
                    style={styles.button_add}
                    onPress={() => {
                        Actions.popTo("add_wallet", {selected: this.state.selectedWallets});
                        Actions.refresh({selected: this.state.selectedWallets});
                    }}>
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
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    search_box: {
        width: '84%',
        height: 45,
        backgroundColor: '#f6f6f6',
        borderRadius: '$buttonRadius',
        marginLeft: '$screen_padding_horizontal',
        marginTop: 20,
        marginRight: '$screen_padding_horizontal',
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
        marginLeft: '$screen_padding_horizontal',
        marginTop: 20,
        marginRight: '$screen_padding_horizontal',
        marginBottom: '$screen_padding_bottom'
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
        color: '$primaryColor',
        fontFamily: '$primaryFontBold',
        fontSize: 16
    }
});