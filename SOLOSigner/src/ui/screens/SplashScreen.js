import React from 'react';
import {StyleSheet, View, YellowBox, Platform} from 'react-native';
import TimerMixin from 'react-timer-mixin';

import {colorPrimary, dimenScreenWidth, icons} from '../../res';
import {AnimatedView} from "../components";

import Globals from '../../services/GlobalService';

import { SVG } from '../components/';

export default class SplashScreen extends React.Component {

    componentDidMount() {
        YellowBox.ignoreWarnings(['Warning: isMounted(...)']);
        YellowBox.ignoreWarnings(['Warning: Failed prop type']);
        this.timer = TimerMixin.setTimeout(
            () => this.handleFlow(),
            3000
        );
    }

    handleFlow() {
        TimerMixin.clearTimeout(this.timer);
        Globals.checkWalletExisting(); // Open right screen
    }

    render() {
        let logoWidth = 64 * dimenScreenWidth / 100;
        let logoHeight = 37.8 * logoWidth / 100;

        return (
            <View style={styles.container}>
                <AnimatedView animation='fade_in' duration={500}>
                    <SVG 
                        width={logoWidth.toString()} 
                        height={logoHeight.toString()}
                        svg={icons.icSoloLogo}
                    />
                </AnimatedView>    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorPrimary
    }
});