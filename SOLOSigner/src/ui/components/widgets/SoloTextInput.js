'use strict';

import React from 'react';
import {TextInput} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {BaseBorderStyle} from '../../../res/button.styles';

export default class SoloTextInput extends React.Component {
    render() {
        return (
            <TextInput
                placeholder="Enter text"
                placeholderTextColor={StyleSheet.value('$textContentColor')}
                underlineColorAndroid='transparent'
                {...this.props}
                style={[styles.customFont, this.props.style]}/>
        )
    }
}

const styles = StyleSheet.create({
    customFont: {
        ...BaseBorderStyle,
        fontFamily: '$primaryFont',
        fontSize: 14,
        color: '$textTitleColor',
    }
});