'use strict';

import React from 'react';
import {StyleSheet, View} from "react-native";
import PropTypes from 'prop-types';

import {
    colorPrimary,
    colorTitleText,
    dimenScreenPaddingBottom,
    icons,
    styleButtonBack,
    styleButtonContinue
} from '../../../res';
import SoloButton from "../widgets/SoloButton";

export default class ScreenFooterActions extends React.Component {
    render() {
        let colorBtnBack = (this.props.buttonsColor && this.props.buttonsColor.back) || colorTitleText;
        let colorBtnContinue = (this.props.buttonsColor && this.props.buttonsColor.continue) || colorPrimary;
        let leftButtonText = this.props.leftButtonText || 'Back';
        let rightButtonText = this.props.rightButtonText || 'Continue';
        return (
            <View {...this.props} style={[styles.footer_button, this.props.style]}>
                {
                    this.props.onBackPress &&
                    <SoloButton title={leftButtonText}
                                style={styleButtonBack}
                                fontSize={16}
                                icon={icons.icArrowLeft}
                                iconColor={colorBtnBack}
                                onPress={this.props.onBackPress}/>
                }
                {
                    this.props.onContinuePress &&
                    <SoloButton title={rightButtonText}
                                titleBold={true}
                                style={styleButtonContinue}
                                enabled={this.props.enabledContinue}
                                fontSize={16}
                                icon={icons.icArrowRight}
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
        height: dimenScreenPaddingBottom,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
});

ScreenFooterActions.propTypes = {
    buttonsColor: PropTypes.objectOf(PropTypes.string),
    leftButtonText: PropTypes.string,
    rightButtonText: PropTypes.string,
    onBackPress: PropTypes.func,
    onContinuePress: PropTypes.func,
    enabledContinue: PropTypes.bool,
};