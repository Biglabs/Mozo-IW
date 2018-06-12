import React, {Component} from "react";
import {TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button, SelectionGroup, Text, WalletButton} from "../../components/SoloComponent";

export default class CreateWalletScreen extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>Create New Wallet</Text>

                <SelectionGroup>
                    <WalletButton label="Express"
                                  content="Select this option if you’d like to access your new SOLO Wallet quickly. Please note that you’ll always be able to customize at a later time."
                                  icon={require('../../res/icons/ic_flash.svg')}
                                  style={styles.buttons}/>

                    <WalletButton title="Custom"
                                  content="Select this option if you’d like to customize your wallet. You’ll be able to select your wallet Tokens and Currencies, set up a security PIN, and back up your wallet."
                                  icon={require('../../res/icons/ic_settings.svg')}
                                  style={[styles.buttons, {marginTop: 20}]}/>
                </SelectionGroup>

                <Button title='Back'
                        style={styles.button_back}
                        icon={require('../../res/icons/ic_arrow_left.svg')}
                        onPress={() => {
                            Actions.pop();
                        }}/>

                <Button title='Continue'
                        titleBold={true}
                        style={styles.button_continue}
                        icon={require('../../res/icons/ic_arrow_right.svg')}
                        iconPosition='right'
                        onPress={() => {
                            Actions.main_tab_bar();
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
        width: '100%'
    },
    button_back: {
        position: 'absolute',
        bottom: 0,
    },
    button_continue: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'flex-end',
    },
});