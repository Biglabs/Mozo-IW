'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {TextInput} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {BaseBorderStyle} from '../../../res/button.styles';
import SelectionGroup from "./SelectionGroup";

export default class SoloTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.borderError = StyleSheet.value('$errorColor');
        this.borderNormal = StyleSheet.value('$borderColor');
    }

    render() {
        let stylesArr = [styles.customFont, this.props.style];
        stylesArr.push({borderColor: (this.props.error || false) ? this.borderError : this.borderNormal});
        return (
            <TextInput
                placeholder="Enter text"
                placeholderTextColor={StyleSheet.value('$textContentColor')}
                underlineColorAndroid='transparent'
                {...this.props}
                style={stylesArr}/>
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

SelectionGroup.propTypes = {
    error: PropTypes.bool
};