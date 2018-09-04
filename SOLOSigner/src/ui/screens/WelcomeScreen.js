import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {colorPrimary, colorScreenBackground, dimenScreenWidth, icons} from '../../res';
import {Button, SvgView, Text} from "../components";
import { strings } from '../../helpers/i18nUtils';

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
                <SvgView
                    width={this.logoWidth}
                    height={this.logoHeight}
                    fill={colorPrimary}
                    svg={icons.icSoloLogo}
                    style={{
                        flex: .5,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        ...Platform.select({
                            web: {alignItems: 'flex-end', display: 'flex'}
                        }),
                    }}
                />

                <Text style={styles.welcome_text}>{strings('welcome.lbWelcome')}</Text>

                <View style={styles.button_container}>
                    <Button title={strings('welcome.btnCreate')}
                            style={styles.buttons}
                            type='solid'
                            onPress={() => Actions.create_wallet()}/>

                    <Button title={strings('welcome.btnImport')}
                            style={styles.buttons}
                            onPress={() => Actions.import_wallet()}/>

                    {/*<Button title={strings('welcome.btnRestore')}
                            style={styles.buttons}
                            onPress={() => Actions.restore_wallet()}/> */}
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
