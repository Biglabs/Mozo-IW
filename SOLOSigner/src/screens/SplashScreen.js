import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

import TimerMixin from 'react-timer-mixin';
import SvgUri from 'react-native-svg-uri';

type Props = {};
export default class SplashScreen extends Component<Props> {

    componentDidMount() {
        this.timer = TimerMixin.setTimeout(
            () => {
                Actions.replace("tabbar");
            }, 3000
        );
    }

    componentWillUnmount() {
        TimerMixin.clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                <SvgUri source={require('../images/logo.svg')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#006DFF'
    }
});