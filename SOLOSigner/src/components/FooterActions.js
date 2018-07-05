'use strict';

import React from 'react';
import {View} from "react-native";
import StyleSheet from "react-native-extended-stylesheet";
import Button from "./SoloButton";
import {icArrowLeft, icArrowRight} from '../res/icons';

export default class FooterActions extends React.Component {
    render() {
        let colorBtnBack = (this.props.buttonsColor && this.props.buttonsColor.back) || StyleSheet.value('$textTitleColor');
        let colorBtnContinue = (this.props.buttonsColor && this.props.buttonsColor.continue) || StyleSheet.value('$primaryColor');
        let leftButtonText = this.props.leftButtonText || 'Back';
        let rightButtonText = this.props.rightButtonText || 'Continue';
        return (
            <View {...this.props} style={[styles.footer_button, this.props.style]}>
                {
                    this.props.onBackPress &&
                    <Button title={leftButtonText}
                            style={StyleSheet.value('$back_button')}
                            fontSize={16}
                            icon={icArrowLeft}
                            iconColor={colorBtnBack}
                            onPress={this.props.onBackPress}/>
                }
                {
                    this.props.onContinuePress &&
                    <Button title={rightButtonText}
                            titleBold={true}
                            style={StyleSheet.value('$continue_button')}
                            enabled={this.props.enabledContinue}
                            fontSize={16}
                            icon={icArrowRight}
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