import React, {Component} from 'react';
import {Dimensions, Text, View, YellowBox} from 'react-native';
import {Actions} from 'react-native-router-flux';
import TimerMixin from 'react-timer-mixin';
import SvgUri from 'react-native-svg-uri';
import StyleSheet from 'react-native-extended-stylesheet';
import {FadeInView} from "../components/SoloComponent";

export default class SplashScreen extends Component<Props> {

    componentDidMount() {
        YellowBox.ignoreWarnings(['Warning: isMounted(...)']);
        this.timer = TimerMixin.setTimeout(
            () => {
                Actions.reset('welcome');
            }, 3000
        );
    }

    componentWillUnmount() {
        TimerMixin.clearTimeout(this.timer);
    }

    render() {
        let {width} = Dimensions.get('window');
        let logoWidth = 64 * width / 100;
        let logoHeight = 37.8 * logoWidth / 100;
        return (
            <View style={styles.container}>
                <FadeInView duration={500}>
                    <SvgUri width={logoWidth} height={logoHeight} source={require('../res/images/logo.svg')}/>
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