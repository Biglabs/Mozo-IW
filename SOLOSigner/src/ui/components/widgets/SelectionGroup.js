'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

export default class SelectionGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedIndex: -1}
    }

    onChildPress(index) {
        this.setState({
            selectedIndex: index
        }, () => {
            if (this.props.onSelectionChanged !== 'undefined') {
                this.props.onSelectionChanged(this.state.selectedIndex);
            }
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

SelectionGroup.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    onSelectionChanged: PropTypes.func,
};