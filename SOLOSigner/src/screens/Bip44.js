import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, Alert} from 'react-native';

type Props = {};
export default class Bip44 extends Component<Props> {

    constructor(props) {
        super(props);

        Alert.alert(
            'Alert Title',
            this.props.seed,
            [
                {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
        )
    }

    render() {
        return (
            <View key="bip44" style={styles.container}>
                <Text>
                    Bip44
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});