'use strict';

import React, {Component} from 'react';
import {View} from "react-native";
import StyleSheet from "react-native-extended-stylesheet";
import Button from "./SoloButton";


export default class FooterActions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let colorBtnBack = (this.props.buttonsColor && this.props.buttonsColor.back) || StyleSheet.value('$textTitleColor');
        let colorBtnContinue = (this.props.buttonsColor && this.props.buttonsColor.continue) || StyleSheet.value('$primaryColor');
        return (
            <View {...this.props} style={[styles.footer_button, this.props.style]}>
                {
                    this.props.onBackPress &&
                    <Button title='Back'
                            style={StyleSheet.value('$back_button')}
                            fontSize={16}
                            icon={require('../res/icons/ic_arrow_left.svg')}
                            iconColor={colorBtnBack}
                            onPress={this.props.onBackPress}/>
                }
                {
                    this.props.onContinuePress &&
                    <Button title='Continue'
                            titleBold={true}
                            style={StyleSheet.value('$continue_button')}
                            enabled={this.props.enabledContinue}
                            fontSize={16}
                            icon={require('../res/icons/ic_arrow_right.svg')}
                            iconColor={colorBtnContinue}
                            iconPosition='right'
                            onPress={this.props.onContinuePress}/>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    footer_button: {
        height: '$screen_padding_bottom',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
});