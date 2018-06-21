import React, { Component } from 'react';
import { Dimensions, View, YellowBox, Linking, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import TimerMixin from 'react-timer-mixin';
import SvgUri from 'react-native-svg-uri';
import StyleSheet from 'react-native-extended-stylesheet';
import { FadeInView } from "../components/SoloComponent";
import {SchemeHandler} from "../utils/LinkingManager";

export default class SplashScreen extends Component {

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
        Linking.getInitialURL().then(this.checkScheme).catch(this.checkScheme);
    }

    isDbExisting = async function(){
        try {
            const value = await AsyncStorage.getItem('@DbExisting:key');
            if (value !== null){
              console.log(value);
              return value;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    }
    
    checkScheme(url) {
        if (url && String(url).startsWith('solosigner')) {
            SchemeHandler(url);
        } else {
            //If DB is existing, open PIN screen for user to enter their PIN
            var dbExisting = this.isDbExisting;
            if(dbExisting){
                Actions.security_pin({ isNewPin : false });
            } else {
                //Else open welcome screen
                Actions.reset('welcome');
            }
        }
    }

    render() {
        let { width } = Dimensions.get('window');
        let logoWidth = 64 * width / 100;
        let logoHeight = 37.8 * logoWidth / 100;
        return (
            <View style={styles.container}>
                <FadeInView duration={500}>
                    <SvgUri width={logoWidth} height={logoHeight} source={require('../res/icons/logo.svg')} />
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