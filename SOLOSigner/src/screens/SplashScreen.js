import React from 'react';
import {Dimensions, View, YellowBox} from 'react-native';
import TimerMixin from 'react-timer-mixin';
import SvgUri from 'react-native-svg-uri';
import StyleSheet from 'react-native-extended-stylesheet';
import {FadeInView} from "../components/SoloComponent";
import Globals from '../common/Globals';
import {icSoloLogo} from '../res/icons';

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
        let {width} = Dimensions.get('window');
        let logoWidth = 64 * width / 100;
        let logoHeight = 37.8 * logoWidth / 100;
        return (
            <View style={styles.container}>
                <FadeInView duration={500}>
                    <SvgUri width={logoWidth} height={logoHeight} svgXmlData={icSoloLogo}/>
                </FadeInView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '$primaryColor'
    }
});