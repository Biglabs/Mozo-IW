import React, {Component} from "react";
import {TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button, Text} from "../../components/SoloComponent";


export default class CreateWalletScreen extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>Create New Wallet</Text>

                <TouchableOpacity style={styles.buttons}
                                  onPress={() => {
                                      Actions.main_tab_bar();
                                  }}>
                    <Text style={styles.button_name}>Express</Text>

                    <Text style={styles.button_content}>Select this option if you’d like to access your new SOLO Wallet quickly. Please note that you’ll always be able to customize at a later time.</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttons}
                                  onPress={() => {
                                      Actions.main_tab_bar();
                                  }}>
                    <Text style={styles.button_name}>Custom</Text>

                    <Text style={styles.button_content}>Select this option if you’d like to customize your wallet. You’ll be able to select your wallet Tokens and Currencies, set up a security PIN, and back up your wallet.</Text>
                </TouchableOpacity>

                <Button title='Back'
                        style={styles.button_back}
                        onPress={() => {
                            Actions.pop();
                        }}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 30,
        paddingRight: 30
    },
    buttons: {
        width: '100%',
        borderRadius: '$buttonRadius',
        borderColor: '#cdcdcd',
        borderWidth: 1,
        padding: 16
    },
    button_name: {
        fontFamily: 'utm-avo-bold',
        fontSize: 16,
        color: '#141a22',
    },
    button_content: {
        fontFamily: 'utm-avo',
        fontSize: 12,
        color: '#747474',
    },
    button_back: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
});