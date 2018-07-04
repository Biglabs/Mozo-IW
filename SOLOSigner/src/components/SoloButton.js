'use strict';

import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import * as ButtonStyles from '../res/button.styles';

export default class SoloButton extends Component {
    constructor(props) {
        super(props);
        switch (props.type ? props.type : '') {
            case "solid":
                this.style = styles.solid;
                break;
            case "border-primary":
                this.style = styles.border_primary;
                break;
            case "border-gray":
            default:
                this.style = styles.border_gray;
                break;
        }
        this.disableColor = StyleSheet.value('$disableColor');
        this.hasIcon = (typeof props.icon !== 'undefined') || false;
        this.iconColor = props.iconColor || StyleSheet.value('$textTitleColor');
        this.iconSize = 20;
        this.paddingVertical = 27;
        this.paddingHorizontal = StyleSheet.value('$screen_padding_horizontal');
        let spacing = 9;

        this.font = StyleSheet.value(props.titleBold === true ? '$primaryFontBold' : '$primaryFont');
        this.fontSize = props.fontSize || 16;
        this.textPadding = ((this.iconSize + this.paddingVertical * 2) - this.fontSize) / 2;
        this.textPaddingHorizontal = this.paddingHorizontal + this.iconSize + spacing;

        this.isIconRight = props.iconPosition === 'right';
        const offsetFontPadding = 6;
        if (this.isIconRight) {
            this.textStyle = {
                color: this.iconColor,
                fontFamily: this.font,
                fontSize: this.fontSize,
                paddingTop: this.textPadding - offsetFontPadding,
                paddingRight: this.textPaddingHorizontal,
                paddingBottom: this.textPadding,
            };
            this.iconStyle = {
                position: 'absolute',
                alignSelf: 'flex-end',
                top: this.paddingVertical,
                right: this.paddingHorizontal
            };
        } else {
            this.textStyle = {
                color: this.iconColor,
                fontFamily: this.font,
                fontSize: this.fontSize,
                paddingTop: this.textPadding - offsetFontPadding,
                paddingLeft: this.textPaddingHorizontal,
                paddingBottom: this.textPadding,
            };
            this.iconStyle = {
                position: 'absolute',
                top: this.paddingVertical,
                left: this.paddingHorizontal
            };
        }
    }

    render() {
        let finalTextStyle = [];
        if (this.hasIcon) {
            finalTextStyle.push(styles.width_icon);
            finalTextStyle.push(this.textStyle);
        } else {
            finalTextStyle.push(this.style);
        }

        let finalIconColor = this.iconColor;

        let isEnabled = (typeof this.props.enabled === 'undefined') || this.props.enabled;
        if (!isEnabled) {
            finalTextStyle.push({
                color: this.disableColor,
            });
            finalIconColor = this.disableColor;
        }
        if (this.props.textStyle) {
            finalTextStyle.push(this.props.textStyle);
        }

        return (
            <TouchableOpacity {...this.props} disabled={!isEnabled}>
                <Text style={finalTextStyle} suppressHighlighting={true}>
                    {this.props.title}
                </Text>

                {
                    this.hasIcon
                    && <SvgUri width={this.iconSize}
                               height={this.iconSize}
                               fill={finalIconColor}
                               source={this.props.icon}
                               style={this.iconStyle}/>
                }
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    width_icon: {
        ...ButtonStyles.SolidStyle,
        backgroundColor: 'transparent',
    },
    solid: {
        ...ButtonStyles.SolidStyle
    },
    border_gray: {
        ...ButtonStyles.BorderGrayStyle
    },
    border_primary: {
        ...ButtonStyles.BorderPrimaryStyle
    }
});