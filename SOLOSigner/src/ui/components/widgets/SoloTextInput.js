'use strict';

import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import PropTypes from 'prop-types';

import {buttons, colorBorder, colorContentText, colorError, colorTitleText, fontRegular} from '../../../res';
import SelectionGroup from "./SelectionGroup";

export default class SoloTextInput extends React.Component {
    render() {
        let stylesArr = [styles.customFont, this.props.style];
        stylesArr.push({borderColor: (this.props.error || false) ? colorError : colorBorder});
        return (
            <TextInput
                placeholder="Enter text"
                placeholderTextColor={colorContentText}
                underlineColorAndroid='transparent'
                {...this.props}
                style={stylesArr}/>
        )
    }
}

const styles = StyleSheet.create({
    customFont: {
        ...buttons.BaseBorderStyle,
        fontFamily: fontRegular,
        fontSize: 14,
        color: colorTitleText,
        paddingLeft: 20,
        paddingTop: 12,
        paddingRight: 20,
        paddingBottom: 14,
    }
});

SelectionGroup.propTypes = {
    error: PropTypes.bool
};