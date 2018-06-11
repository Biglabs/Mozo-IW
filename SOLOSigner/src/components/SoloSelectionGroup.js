'use strict';

import React, {Component} from 'react';
import {View} from 'react-native';

export default class SoloSelectionGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedIndex: -1}
    }

    onChildPress(index) {
        this.setState({
            selectedIndex: index
        }, () => {
            console.log('onChildPress');
        });
    }

    render() {
        return (
            <View {...this.props} onPress={this.props.onPress}>
                {
                    this.props.children.map((child, index) => {
                        let newProps = {
                            key: index,
                            ...child.props,
                            selected: index === this.state.selectedIndex,
                            onPress: () => this.onChildPress(index)
                        };
                        return (React.cloneElement(child, newProps))
                    })
                }
            </View>
        )
    }
}