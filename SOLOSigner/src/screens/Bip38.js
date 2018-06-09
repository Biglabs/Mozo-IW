import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';

export default class Bip38 extends Component<Props> {

    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Bip38
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