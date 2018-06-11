import React, {Component} from "react";
import {TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button, WalletButton, Text} from "../../components/SoloComponent";

export default class CreateWalletScreen extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>Create New Wallet</Text>

                <WalletButton label="Express"
                              content="Select this option if you’d like to access your new SOLO Wallet quickly. Please note that you’ll always be able to customize at a later time."
                              style={styles.buttons}
                              onPress={() => {
                                  Actions.main_tab_bar();
                              }}/>

                <WalletButton title="Custom"
                              content="Select this option if you’d like to customize your wallet. You’ll be able to select your wallet Tokens and Currencies, set up a security PIN, and back up your wallet."
                              style={[styles.buttons, {marginTop: 20}]}
                              onPress={() => {
                                  Actions.main_tab_bar();
                              }}/>

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
    }
});