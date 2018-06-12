import React, {Component} from "react";
import {TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button, Text, TextInput} from "../../components/SoloComponent";


export default class ImportWalletScreen extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>Import/Restore Wallet</Text>

                <Text style={StyleSheet.value('$screen_sub_title_text')}>
                    Type in your wallet’s Backup Phrase in the correct sequence below to pair.
                </Text>

                <TextInput
                    style={styles.phrase_input}
                    placeholder='Enter Backup Phrase'
                    multiline={true}
                    onChangeText={(text) => this.setState({text})}/>

                <Button title='Back'
                        style={StyleSheet.value('$back_button')}
                        icon={require('../../res/icons/ic_arrow_left.svg')}
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
    phrase_input: {
        width: '100%',
        minHeight: 90,
        marginTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'auto'
    },
});