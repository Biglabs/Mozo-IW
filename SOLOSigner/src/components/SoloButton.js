'use strict';

import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

export default class SoloButton extends Component {
    constructor(props) {
        super(props);

        this.style = [styles.common];

        switch (props.type ? props.type : '') {
            case "solid":
                this.style.push(styles.solid);
                break;
            default:
                this.style.push(styles.border);
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
    common: {
        borderRadius: 5,
        color: '#ffffff',
        fontFamily: 'utm-avo',
        fontSize: 16,
        paddingLeft: 20,
        paddingTop: 12,
        paddingRight: 20,
        paddingBottom: 14,
        textAlign: 'center',
    },
    solid: {
        backgroundColor: '$primaryColor',
        overflow: 'hidden'
    },
    border: {
        color: '#666666',
        borderColor: '#cdcdcd',
        borderWidth: 1,
    }
});