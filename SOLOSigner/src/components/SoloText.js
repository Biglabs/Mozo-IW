'use strict';

import React, {Component} from 'react';
import {Text} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

export default class SoloText extends Component {
    render() {
        return (
            <Text {...this.props} style={[styles.customFont, this.props.style]}>
                {this.props.children}
            </Text>
        )
    }
}

const styles = StyleSheet.create({
    customFont: {
        fontFamily: '$primaryFont',
        fontSize: 14
    }
});