'use strict';

import React, {Component} from 'react';
import {Text} from 'react-native';

export default class SoloText extends Component {
    constructor(props) {
        super(props);
        this.style = [{fontFamily: 'UTM Avo', fontSize: 14}];
        if (props.style) {
            if (Array.isArray(props.style)) {
                this.style = this.style.concat(props.style)
            } else {
                this.style.push(props.style)
            }
        }
    }

    render() {
        return (
            <Text {...this.props} style={this.style}>
                {this.props.children}
            </Text>
        )
    }
}