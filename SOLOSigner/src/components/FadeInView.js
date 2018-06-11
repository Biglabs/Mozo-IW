'use strict';

import React, {Component} from 'react';
import {Animated} from 'react-native';

export default class FadeInView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnimate: new Animated.Value(0),
        };
    }

    componentDidMount() {
        let durationTime = this.props.duration ? this.props.duration : 3000;
        Animated.timing(this.state.fadeAnimate, {
            toValue: 1,
            duration: durationTime,
        }).start();
    }

    render() {
        return (
            <Animated.View style={{...this.props.style, opacity: this.state.fadeAnimate}}>
                {this.props.children}
            </Animated.View>
        );
    }
}