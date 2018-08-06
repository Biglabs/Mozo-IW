'use strict';

import React from 'react';
import {Text, TouchableOpacity,Platform} from 'react-native';
import SvgUri from 'react-native-svg-uri';

import {buttons, colorDisable, colorTitleText, dimenScreenPaddingHorizontal, fontBold, fontRegular} from '../../../res';
// use for display svg on web
import SVGInline from "react-svg-inline";

export default class SoloButton extends React.Component {
    constructor(props) {
        super(props);
        switch (props.type ? props.type : '') {
            case "solid":
                this.style = buttons.SolidStyle;
                break;
            case "border-primary":
                this.style = buttons.BorderPrimaryStyle;
                break;
            case "border-gray":
            default:
                this.style = buttons.BorderGrayStyle;
                break;
        }
        this.disableColor = colorDisable;
        this.hasIcon = (typeof props.icon !== 'undefined') || false;
        this.iconColor = props.iconColor || colorTitleText;
        this.iconSize = 20;
        this.paddingVertical = 27;
        this.paddingHorizontal = dimenScreenPaddingHorizontal;
        let spacing = 9;

        this.font = props.titleBold === true ? fontBold : fontRegular;
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

    renderSVG(data, finalIconColor){
        if(Platform.OS.toUpperCase() ==="WEB"){
            return(
                <SVGInline 
                    width={data.iconSize.toString()}
                    height={data.iconSize.toString()}
                    fill={finalIconColor.toString()}
                    svg={data.props.icon}
                    style={data.iconStyle}
                />
            );
        }
        return (
            <SvgUri 
                width={data.iconSize}
                height={data.iconSize}
                fill={finalIconColor}
                svgXmlData={data.props.icon}
                style={data.iconStyle}
            />
        );
    }
    render() {
        let finalTextStyle = [];
        if (this.hasIcon) {
            finalTextStyle.push(buttons.SolidStyle);
            finalTextStyle.push({backgroundColor: 'transparent'});
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
                    && this.renderSVG(this, finalIconColor) 
                }
            </TouchableOpacity>
        )
    }
}