import React, {Component} from "react";
import {TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {Button, Text} from "../../components/SoloComponent";


export default class AddWalletScreen extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>Add Wallet</Text>

                <Text style={StyleSheet.value('$screen_sub_title_text')}>
                    Please select the wallet you wish to active
                </Text>

                <Text style={
                    [
                        StyleSheet.value('$screen_explain_text'),
                        {marginTop: 10}
                    ]}>
                    We require you to active at least one wallet. Please note that additional wallets can be activated
                    later time.
                </Text>


                <Button title='Back'
                        style={StyleSheet.value('$back_button')}
                        fontSize={16}
                        icon={require('../../res/icons/ic_arrow_left.svg')}
                        onPress={() => {
                            Actions.pop();
                        }}/>

                <Button title='Continue'
                        titleBold={true}
                        style={StyleSheet.value('$continue_button')}
                        fontSize={16}
                        icon={require('../../res/icons/ic_arrow_right.svg')}
                        iconColor={StyleSheet.value('$primaryColor')}
                        iconPosition='right'
                        onPress={() => {

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