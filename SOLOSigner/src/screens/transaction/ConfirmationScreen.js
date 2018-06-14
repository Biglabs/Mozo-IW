import React, {Component} from "react";
import {TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button, Text} from "../../components/SoloComponent";


export default class ConfirmationScreen extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>SEND CONFIRMATION</Text>

                <Button title='Back'
                        style={StyleSheet.value('$back_button')}
                        fontSize={16}
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
});