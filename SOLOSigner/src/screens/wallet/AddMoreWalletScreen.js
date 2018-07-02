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

        const selectedWallets = this.props.selected;

        this.wallets = [];
        this.selectedIndex = [];
        Object.keys(Constant.COIN_TYPE).map((key, index) => {
            let coin = Constant.COIN_TYPE[key];
            if (selectedWallets.includes(coin)) {
                this.selectedIndex.push(index);
                coin.selected = true;
            }
            this.wallets.push(coin);
        });

        this.state = {
            wallets: this.wallets,
            selectedIndex: this.selectedIndex
        }
    }

    onItemClicked = (index) => {
        const coin = this.wallets[index];
        this.wallets[index].selected = !coin.selected;

        if (this.selectedIndex.includes(index)) {
            this.selectedIndex.splice(this.selectedIndex.indexOf(index), 1);
        } else {
            this.selectedIndex.push(index);
        }

        this.setState({
            wallets: this.wallets,
            selectedIndex: this.selectedIndex
        });
    };

    render() {
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
                        onSubmitEditing={() => {
                        }}/>

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
                    extraData={this.state.selectedIndex.length}
                    keyExtractor={(item, index) => `${item.key}-${index}`}
                    renderItem={({item, index}) =>
                        <CoinItemView
                            id={index}
                            icon={item.icon}
                            label={item.name}
                            checked={item.selected || false}
                            onItemClicked={this.onItemClicked}/>
                    }
                />

                <TouchableOpacity
                    style={styles.button_add}
                    onPress={() => {
                    }}>
                    <Text style={styles.button_add_text}>
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