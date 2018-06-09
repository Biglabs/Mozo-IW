import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import {Button, Text} from "../components/SoloComponent";

export default class WelcomeScreen extends Component<Props> {
    render() {
        let {width} = Dimensions.get('window');
        let logoWidth = 64 * width / 100;
        let logoHeight = 37.8 * logoWidth / 100;

        return (
            <View style={styles.container}>
                <SvgUri width={logoWidth}
                        height={logoHeight}
                        fill={StyleSheet.value('$primaryColor')}
                        source={require('../res/images/logo.svg')}
                        style={{
                            flex: .5,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}/>

                <Text style={styles.welcome_text}>Welcome to SOLO Signer</Text>

                <View style={styles.button_container}>
                    <Button title='Create New Wallet' style={[styles.buttons, {marginBottom: 15}]} type='solid'
                            onPress={() => Actions.main_tab_bar()}/>
                    <Button title='Import Wallet' style={styles.buttons} onPress={() => {
                        console.log('Import Wallet');
                    }}/>
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
        backgroundColor: '$screenBackground'
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
        width: '84%',
    },
    '@media (min-width: 500)': {
        buttons: {
            width: '44%',
        }
    }
});