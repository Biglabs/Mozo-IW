'use strict';

import React from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {fontRegular} from '../../../res';

export default class SoloText extends React.Component {

    setNativeProps = (nativeProps) => {

    }

    render() {
        return <Text {...this.props}
                     style={[styles.customFont, this.props.style]}>
            {this.props.children}
        </Text>
    }
}

const styles = StyleSheet.create({
    customFont: {
        fontFamily: fontRegular,
        fontSize: 14,
        ...Platform.select({
            android: {includeFontPadding: false}
        }),
    }
});