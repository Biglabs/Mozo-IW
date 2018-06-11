'use strict';

import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import SvgUri from 'react-native-svg-uri';
import Text from "./SoloText";
import * as ButtonStyles from '../res/button.styles';

export default class SoloWalletButton extends Component {
    constructor(props) {
        super(props);
        this.label = props.label || props.title || 'Label';
        this.content = props.content || props.children || 'content';
    }

    render() {
        return (
            <TouchableOpacity {...this.props} style={[styles.buttons, this.props.style]} onPress={this.props.onPress}>
                <SvgUri width={18}
                        height={18}
                        fill={StyleSheet.value('$primaryColor')}
                        source={require('../res/icons/ic_monetization.svg')}
                        style={styles.icon}
                />

                <Text style={styles.button_name}>{this.label}</Text>

                <Text style={styles.button_content}>{this.content}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        marginLeft: 14,
        marginTop: 18,
    },
    buttons: {
        ...ButtonStyles.BorderGrayStyle,
        paddingLeft: 40,
        paddingTop: 14,
        paddingRight: 40,
        paddingBottom: 16,
        minHeight: 130
    },
    button_name: {
        fontFamily: 'utm-avo-bold',
        fontSize: 16,
        color: '$textTitleColor',
    },
    button_content: {
        fontFamily: 'utm-avo',
        fontSize: 12,
        color: '$textContentColor',
    },
    button_back: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
});