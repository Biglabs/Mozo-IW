import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {colorPrimary, colorScreenBackground, dimenScreenWidth, icons} from '../../res';
import {Button, Text} from "../components";

import { SVG } from '../components/';

const buttonWidthPercent = dimenScreenWidth >= 500 ? '44%' : '84%';

export default class WelcomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.logoWidth = 64 * dimenScreenWidth / 100;
        this.logoHeight = 37.8 * this.logoWidth / 100;
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <SVG
                        width={this.logoWidth.toString()}
                        height={this.logoHeight.toString()}
                        fill={colorPrimary.toString()}
                        svg={icons.icSoloLogo}
                        style={{
                            flex: .5,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    /> 
                </View>

                <Text style={styles.welcome_text}>Welcome to SOLO Signer</Text>

                <View style={styles.button_container}>
                    <Button title='Create New Wallet'
                            style={styles.buttons}
                            type='solid'
                            onPress={() => Actions.create_wallet()}/>

                    <Button title='Import Wallet'
                            style={styles.buttons}
                            onPress={() => Actions.import_wallet()}/>

                    <Button title='Restore Encrypted Wallet'
                            style={styles.buttons}
                            onPress={() => Actions.restore_wallet()}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorScreenBackground
    },
    welcome_text: {
        color: '#141a22',
        fontSize: 22,
        marginTop: 88,
        marginBottom: 45,
    },
    button_container: {
        width: '100%',
        flex: .4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttons: {
        width: buttonWidthPercent,
        marginBottom: 15,
    },
});