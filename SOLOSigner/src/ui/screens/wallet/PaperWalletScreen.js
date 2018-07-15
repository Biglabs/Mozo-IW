import React, {Component} from "react";
import {StyleSheet, View} from 'react-native';

import {ScreenHeaderActions} from "../../components";
import {colorScreenBackground} from '../../../res';

export default class PaperWalletScreen extends Component {
    render() {
        return (
            <View style={styles.container}>

                <ScreenHeaderActions title='Paper Wallet'/>

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
});