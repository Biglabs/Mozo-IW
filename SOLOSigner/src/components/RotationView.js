'use strict';

import React, {Component} from 'react';
import {Animated, Easing} from 'react-native';

export default class RotationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rotateAnimate: new Animated.Value(0),
        };

        this.spin = this.state.rotateAnimate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
    }

    componentDidMount() {
        let durationTime = this.props.duration ? this.props.duration : 3000;
        this.loadingAnim = Animated.loop(
            Animated.timing(this.state.rotateAnimate, {
                toValue: 1,
                duration: durationTime,
                easing: Easing.linear,
            })
        );
        this.loadingAnim.start();
    }

    componentWillUnmount() {
        if (this.loadingAnim) {
            this.loadingAnim.stop();
        }
    }

    render() {
        return (
            <Animated.View style={{...this.props.style, transform: [{rotate: this.spin}]}}>
                {this.props.children}
            </Animated.View>
        );
    }
}