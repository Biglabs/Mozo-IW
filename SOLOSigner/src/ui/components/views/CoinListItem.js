'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import SoloText from "../widgets/SoloText";
import StyleSheet from 'react-native-extended-stylesheet';
import {icCheckCircle} from '../../../res/icons';

export default class CoinListItem extends React.PureComponent {

    render() {
        let isHandleItemClick = this.props.onItemClicked || false;
        let textRateMargin = this.props.checked ? 30 : 0;
        return (
            <TouchableOpacity
                onPress={() => {
                    if (isHandleItemClick) {
                        this.props.onItemClicked(this.props.id)
                    }
                }}
                {...this.props}
                style={[styles.container, {...this.props.style}]}
                disabled={!isHandleItemClick}>

                <View style={styles.content}>
                    <SvgUri width={24} height={24} svgXmlData={this.props.icon}/>
                    <SoloText style={styles.label}>{this.props.label}</SoloText>

                    <SoloText style={[styles.text_rate, {marginRight: textRateMargin}]}>{"0 usd".toUpperCase()}</SoloText>
                    {
                        this.props.checked &&
                        <SvgUri
                            width={20}
                            height={20}
                            svgXmlData={icCheckCircle}
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

CoinListItem.propTypes = {
    checked: PropTypes.bool,
    onItemClicked: PropTypes.func,
    icon: PropTypes.string,
    label: PropTypes.string,
};