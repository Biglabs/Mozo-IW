import React, {Component} from "react";
import {TouchableOpacity, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button} from "../components/SoloComponent";

export default class HomeScreen extends Component<Props> {
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
        elevation: 11,
    },
    content: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
});