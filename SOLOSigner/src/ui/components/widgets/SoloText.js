'use strict';

import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {fontRegular} from '../../../res';
import {isAndroid} from "../../../helpers/PlatformUtils";

export default class SoloText extends React.Component {
    render() {
        return <Text {...this.props}
                     style={[
                         styles.customFont,
                         isAndroid ? {includeFontPadding: false} : {},
                         this.props.style]}>
            {this.props.children}
        </Text>
    }
}

const styles = StyleSheet.create({
    customFont: {
        fontFamily: fontRegular,
        fontSize: 14,
    }
});