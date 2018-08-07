'use strict';

import React from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';

import SoloText from "../widgets/SoloText";
import SoloSVG from "../widgets/SoloSVG";
import {
    buttons,
    colorBorder,
    colorContentText,
    colorPrimary,
    colorScreenBackground,
    colorTitleText,
    fontBold,
    fontRegular,
    icons
} from '../../../res';

// noinspection JSUnusedLocalSymbols, exclude color, fontFamily, fontSize, textAlign from ButtonStyles.BorderGrayStyle
const {color, fontFamily, fontSize, textAlign, ...buttonGrayStyle} = buttons.BorderGrayStyle;

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
                            backgroundColor: isSelected ? colorPrimary : colorScreenBackground,
                            borderColor: isSelected ? colorPrimary : colorBorder,
                        },
                        this.props.style]}
                    onPress={this.props.onPress}>
                    {
                        this.props.icon &&
                        <SoloSVG width={18}
                                 height={18}
                                 fill={this.props.iconColor || (isSelected ? '#ffffff' : colorTitleText)}
                                 svg={this.props.icon}
                                 style={{
                                     position: 'absolute',
                                     marginLeft: 14,
                                     marginTop: 18,
                                     ...Platform.select({
                                         web: {top: 0, left: 0}
                                     }),
                                 }}/>
                    }
                    <SoloSVG
                        width={20}
                        height={20}
                        fill={'#ffffff'}
                        svg={icons.icCheckCircle}
                        style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            top: 8,
                            right: 8,
                            zIndex: isSelected ? 0 : -1
                        }}
                    />

                    <SoloText style={[
                        styles.button_name,
                        {
                            color: isSelected ? '#ffffff' : colorTitleText
                        }
                    ]}>{this.label}</SoloText>

                    <SoloText style={[
                        styles.button_content,
                        {
                            color: isSelected ? '#ffffff' : colorContentText
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
        fontFamily: fontBold,
        fontSize: 16,
    },
    button_content: {
        fontFamily: fontRegular,
        fontSize: 12,
    },
    shadow: {
        height: 20,
        marginTop: -1,
        resizeMode: 'stretch',
        zIndex: -1
    }
});