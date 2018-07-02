'use strict';

import React, {PureComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import Text from "./SoloText";
import StyleSheet from 'react-native-extended-stylesheet';

export default class CoinItemView extends PureComponent {
    constructor(props) {
        super(props);
        this.id = this.props.id;
        this.icon = this.props.icon;
        this.label = this.props.label;
        this.checked = this.props.checked;
        this.textRateMargin = this.checked ? 30 : 0;
        this.isHandleItemClick = this.props.onItemClicked || false
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.isHandleItemClick) {
                        this.props.onItemClicked(this.id)
                    }
                }}
                {...this.props}
                style={[styles.container, {...this.props.style}]}
                disabled={!this.isHandleItemClick}>

                <View style={styles.content}>
                    <SvgUri width={24} height={24} source={this.icon}/>
                    <Text style={styles.label}>{this.label}</Text>

                    <Text style={[styles.text_rate, {marginRight: this.textRateMargin}]}>{"0 usd".toUpperCase()}</Text>
                    {
                        this.checked &&
                        <SvgUri
                            width={20}
                            height={20}
                            source={require('../res/icons/ic_check_circle.svg')}
                            fill={StyleSheet.value('$primaryColor')}
                            style={{
                                position: 'absolute',
                                right: 0
                            }}/>
                    }
                </View>
                <View style={styles.dash}/>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    content: {
        width: '100%',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 15,
        paddingBottom: 15,

    },
    label: {
        color: '$textTitleColor',
        fontFamily: '$primaryFontBold',
        marginLeft: 10,
        paddingBottom: 5,
    },
    text_rate: {
        color: '$textContentColor',
        fontSize: 12,
        position: 'absolute',
        right: 0,
    },
    dash: {
        width: '100%',
        height: 1,
        backgroundColor: '$disableColor',
    },
});