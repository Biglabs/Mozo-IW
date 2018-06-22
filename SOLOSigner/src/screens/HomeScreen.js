import React, {Component} from "react";
import {Linking, TouchableOpacity, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button, Text} from "../components/SoloComponent";
import {SchemeHandler} from "../utils/LinkingManager";

export default class HomeScreen extends Component {

    componentDidMount() {
        Linking.getInitialURL().then(this.checkScheme).catch(this.checkScheme);
    }

    checkScheme(url) {
        if (url && String(url).startsWith('solosigner')) {
            SchemeHandler(url);
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.toolbar}>
                    <SvgUri
                        width={78}
                        height={36}
                        fill={StyleSheet.value('$primaryColor')}
                        source={require('../res/icons/ic_solo_signer_title.svg')}
                        style={{
                            marginBottom: 10,
                        }}/>
                </View>

                <TouchableOpacity
                    style={[styles.buttons, {marginTop: 20}]}
                    onPress={() => Actions.backup_wallet()}>
                    <SvgUri
                        width={24}
                        height={20}
                        fill={StyleSheet.value('$primaryColor')}
                        source={require('../res/icons/ic_backup.svg')}/>
                    <Text style={[styles.buttons_text, {marginLeft: 7}]}>Backup Wallet</Text>

                    <SvgUri
                        width={20}
                        height={20}
                        source={require('../res/icons/ic_check.svg')}
                        style={{margin: 9}}/>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            source={require('../res/icons/ic_information.svg')}/>
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.dash}/>

                <TouchableOpacity style={styles.buttons}>
                    <SvgUri
                        width={20}
                        height={20}
                        fill={StyleSheet.value('$primaryColor')}
                        source={require('../res/icons/ic_sync.svg')}/>
                    <Text style={styles.buttons_text}>Pair Devices</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            source={require('../res/icons/ic_information.svg')}/>
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.dash}/>

                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => Actions.paper_wallet()}>
                    <SvgUri
                        width={20}
                        height={20}
                        fill={StyleSheet.value('$primaryColor')}
                        source={require('../res/icons/ic_note.svg')}/>
                    <Text style={styles.buttons_text}>Paper Wallet</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            source={require('../res/icons/ic_information.svg')}/>
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.dash}/>

                <View style={styles.content}>
                    <Button title='Bip 39' onPress={() => Actions.tab_bip39()}/>
                    <Button title='Bip 44' onPress={() => Actions.tab_bip44()}/>
                    <Button title='Bip 38' onPress={() => Actions.tab_bip38()}/>
                </View>
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
    toolbar: {
        width: '100%',
        height: 83,
        backgroundColor: '$screenBackground',
        justifyContent: 'flex-end',
        alignItems: 'center',
        shadowColor: '#7ba3d8',
        shadowOffset: {width: 0, height: 3.5},
        shadowOpacity: 0.25,
        shadowRadius: 11,
        elevation: 6,
    },
    buttons: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    buttons_text: {
        color: '$textTitleColor',
        fontSize: 14,
        marginLeft: 11,
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
    content: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
});