import React, {Component} from "react";
import {StyleSheet, View} from 'react-native';

import {ScreenHeaderActions} from "../../components";
import {colorScreenBackground} from '../../../res';
import { strings } from '../../../helpers/i18nUtils';

export default class PaperWalletScreen extends Component {
    render() {
        return (
            <View style={styles.container}>

                <ScreenHeaderActions title={strings('paper_wallet.lbTitle')}/>

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