'use strict';

import React, {Component} from 'react';
import {Animated, Easing} from 'react-native';

const TYPE_FADE_IN = 'fade_in';
const TYPE_ROTATE = 'rotate';

export default class AnimatedView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animateValue: new Animated.Value(0),
        };

        this.animationType = props.animation || TYPE_FADE_IN;
        this.duration = props.duration || 3000;
        this.isLoop = props.loop || false;

        if (this.animationType === TYPE_ROTATE) {
            this.spin = this.state.animateValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            });
        }
    }

    componentDidMount() {
        this.animate = Animated.timing(this.state.animateValue, {
            toValue: 1,
            duration: this.duration,
            easing: Easing.linear,
        });

        if (this.isLoop) {
            this.animate = Animated.loop(this.animate);
        }
        this.animate.start();
    }

    componentWillUnmount() {
        if (this.animate) {
            this.animate.stop();
        }
    }

    render() {
        let animateStyle = [{...this.props.style}];
        switch (this.animationType) {
            case TYPE_FADE_IN:
                animateStyle.push({
                    opacity: this.state.animateValue
                });
                break;

            case TYPE_ROTATE:
                animateStyle.push({
                    transform: [{rotate: this.spin}]
                });
                break;
        }
        return (
            <Animated.View style={animateStyle}>
                {this.props.children}
            </Animated.View>
        );
    }
}