'use strict';

import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import * as ButtonStyles from '../res/button.styles';

export default class SoloButton extends Component {
    constructor(props) {
        super(props);
        switch (props.type ? props.type : '') {
            case "solid":
                this.style = styles.solid;
                break;
            case "border-primary":
                this.style = styles.border_primary;
                break;
            case "border-gray":
            default:
                this.style = styles.border_gray;
                break;
        }
    }

    render() {
        return (
            <TouchableOpacity {...this.props}>
                <Text style={this.style} suppressHighlighting={true}>
                    {this.props.title}
                </Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    solid: {
        ...ButtonStyles.SolidStyle
    },
    border_gray: {
        ...ButtonStyles.BorderGrayStyle
    },
    border_primary: {
        ...ButtonStyles.BorderPrimaryStyle
    }
});