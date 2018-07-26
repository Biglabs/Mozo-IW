import React from 'react';
import {StyleSheet, View, YellowBox, Platform} from 'react-native';
import TimerMixin from 'react-timer-mixin';
import SvgUri from 'react-native-svg-uri';

import {colorPrimary, dimenScreenWidth, icons} from '../../res';
import {AnimatedView} from "../components";
import Svg from 'svgs';
import Globals from '../../services/GlobalService';

import SVGImage from 'react-native-svg-image';

import {Actions} from "react-native-router-flux";

// use for display svg on web
import SVGInline from "react-svg-inline";

// import Svg from Platform.select({web: 'react-svg-inline', android: 'react-native-svg-uri'})
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
        /**old code */
        //Globals.checkWalletExisting(); // Open right screen
        /** end old code */
        /**code for testing */
        //Actions.reset('welcome');
        Globals.checkWalletExisting(); // Open right screen
        /**end code for testing */
    }

    render() {
        let logoWidth = 64 * dimenScreenWidth / 100;
        let logoHeight = 37.8 * logoWidth / 100;
        
        //check platform
        if(Platform.OS.toUpperCase() ==="WEB"){
            return (
                <View style={styles.container}>
                    <AnimatedView animation='fade_in' duration={500}>
                        <SVGInline
                            width={logoWidth.toString()} height={logoHeight.toString()}
                            svg={icons.icSoloLogo} 
                        />
                    </AnimatedView>    
                </View>

            );
        } 
        return (
            <View style={styles.container}> 
                <AnimatedView animation='fade_in' duration={500}>
                    <SvgUri width={logoWidth} height={logoHeight} svgXmlData={icons.icSoloLogo}/>
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