'use strict';

import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import SoloText from "../widgets/SoloText";
import * as ButtonStyles from '../../../res/button.styles';
import {icCheckCircle} from '../../../res/icons/index';
// noinspection JSUnusedLocalSymbols, exclude color, fontFamily, fontSize, textAlign from ButtonStyles.BorderGrayStyle
const {color, fontFamily, fontSize, textAlign, ...buttonGrayStyle} = ButtonStyles.BorderGrayStyle;

export default class CreateWalletOptionItem extends React.Component {
    constructor(props) {
        super(props);
        this.label = props.label || props.title || 'Label';
        this.content = props.content || props.children || 'content';
    }

    render() {
        let horizontalPadding = this.props.icon ? 40 : 16;
        let isSelected = this.props.selected || false;
        return (
            <View {...this.props} style={[this.props.style, styles.container]} onLayout={(event) => {
                this.containerWidth = event.nativeEvent.layout.width;
            }}>
                <TouchableOpacity
                    style={[
                        styles.button_inside,
                        {
                            paddingLeft: horizontalPadding,
                            paddingRight: horizontalPadding,
                            backgroundColor: StyleSheet.value(isSelected ? '$primaryColor' : '$screenBackground'),
                            borderColor: StyleSheet.value(isSelected ? '$primaryColor' : '$borderColor'),
                        },
                        this.props.style]}
                    onPress={this.props.onPress}>
                    {
                        this.props.icon
                        && <SvgUri width={18}
                                   height={18}
                                   fill={this.props.iconColor || (isSelected ? '#ffffff' : StyleSheet.value('$textTitleColor'))}
                                   svgXmlData={this.props.icon}
                                   style={{
                                       position: 'absolute',
                                       marginLeft: 14,
                                       marginTop: 18,
                                   }}/>
                    }

                    <SvgUri width={20}
                            height={20}
                            svgXmlData={icCheckCircle}
                            style={{
                                position: 'absolute',
                                alignSelf: 'flex-end',
                                top: 8,
                                right: 8,
                                zIndex: isSelected ? 0 : -1
                            }}/>

                    <SoloText style={[
                        styles.button_name,
                        {
                            color: isSelected ? '#ffffff' : StyleSheet.value('$textTitleColor')
                        }
                    ]}>{this.label}</SoloText>

                    <SoloText style={[
                        styles.button_content,
                        {
                            color: isSelected ? '#ffffff' : StyleSheet.value('$textContentColor')
                        }
                    ]}>{this.content}</SoloText>
                </TouchableOpacity>

                <Image
                    style={[
                        styles.shadow,
                        {
                            opacity: isSelected ? 1.0 : 0.0,
                            width: this.containerWidth * 0.85 || 0
                        }]}
                    source={require('../../../res/images/im_button_shadow.png')}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    button_inside: {
        ...buttonGrayStyle,
        paddingTop: 14,
        paddingBottom: 16,
        minHeight: 130
    },
    button_name: {
        fontFamily: '$primaryFontBold',
        fontSize: 16,
    },
    button_content: {
        fontFamily: '$primaryFont',
        fontSize: 12,
    },
    shadow: {
        height: 20,
        marginTop: -1,
        resizeMode: 'stretch',
        zIndex: -1
    }
});