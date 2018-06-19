import React, {Component} from "react";
import {View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {NavigationBar} from "../../components/SoloComponent";

export default class PaperWalletScreen extends Component {
    render() {
        return (
            <View style={styles.container}>

                <NavigationBar title='Paper Wallet'/>

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
});