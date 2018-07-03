import React, {Component} from "react";
import {View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {FooterActions, Text} from "../../components/SoloComponent";

export default class ConfirmBackupPhrase extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={StyleSheet.value('$screen_title_text')}>Backup Phrase</Text>


                <FooterActions
                    onBackPress={() => Actions.pop()}
                    onContinuePress={() => {
                        Actions.security_pin({isNewPIN: true, coinTypes: this.props.coinTypes});
                    }}/>
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