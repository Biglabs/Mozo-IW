'use strict';

import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import Text from "./SoloText";
import * as ButtonStyles from '../res/button.styles';
// noinspection JSUnusedLocalSymbols, exclude color, fontFamily, fontSize, textAlign from ButtonStyles.BorderGrayStyle
const {color, fontFamily, fontSize, textAlign, ...buttonGrayStyle} = ButtonStyles.BorderGrayStyle;

export default class SoloWalletButton extends Component {
    constructor(props) {
        super(props);
        this.label = props.label || props.title || 'Label';
        this.content = props.content || props.children || 'content';
    }

    render() {
        let horizontalPadding = this.props.icon ? 40 : 16;
        return (
            <TouchableOpacity {...this.props} style={[styles.buttons, {
                paddingLeft: horizontalPadding,
                paddingRight: horizontalPadding
            }, this.props.style]} onPress={this.props.onPress}>
                {
                    this.props.icon
                    && <SvgUri width={18}
                               height={18}
                               fill={this.props.iconColor || StyleSheet.value('$textTitleColor')}
                               source={this.props.icon}
                               style={{
                                   position: 'absolute',
                                   marginLeft: 14,
                                   marginTop: 18,
                               }}/>
                }

                <Text style={styles.button_name}>{this.label}</Text>

                <Text style={styles.button_content}>{this.content}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    buttons: {
        ...buttonGrayStyle,
        paddingLeft: 16,
        paddingTop: 14,
        paddingRight: 16,
        paddingBottom: 16,
        minHeight: 130
    },
    button_name: {
        fontFamily: '$primaryFontBold',
        fontSize: 16,
        color: '$textTitleColor',
    },
    button_content: {
        fontFamily: '$primaryFont',
        fontSize: 12,
        color: '$textContentColor',
    },
    button_back: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
});