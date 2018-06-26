import React, {Component} from "react";
import {TouchableOpacity, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {NavigationBar, Text} from "../../components/SoloComponent";

export default class BackupWalletScreen extends Component {
    render() {
        return (
            <View style={styles.container}>

                <NavigationBar title='Backup Wallet'/>

                <TouchableOpacity
                    style={[styles.buttons, {marginTop: 20}]}
                    onPress={() => {}}>
                    <Text style={styles.buttons_text}>Backup Wallet</Text>

                    <SvgUri
                        width={20}
                        height={20}
                        source={require('../../res/icons/ic_check.svg')}
                        style={{margin: 9}}/>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            source={require('../../res/icons/ic_information.svg')}/>
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.dash}/>

                <TouchableOpacity style={styles.buttons}>
                    <Text style={styles.buttons_text}>View Backup Phrase</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            source={require('../../res/icons/ic_information.svg')}/>
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.dash}/>
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
    buttons: {
        width: '100%',
        height: 60,
        color: '$textTitleColor',
        fontSize: 14,
        flexDirection: 'row',
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    buttons_text: {
        color: '$textTitleColor',
        fontSize: 14,
        paddingBottom: 4,
    },
    buttons_icon: {
        height: '100%',
        position: 'absolute',
        top: 0,
        right: 0,
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dash: {
        width: '84%',
        height: 1,
        backgroundColor: '$disableColor',
        marginLeft: '$screen_padding_horizontal',
        marginRight: '$screen_padding_horizontal',
    },
});