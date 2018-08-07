'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, View, Platform, Text} from 'react-native';
import SvgUri from 'react-native-svg-uri';

import {colorContentText, colorDisable, colorPrimary, colorTitleText, fontBold, icons} from '../../../res';
import SoloText from "../widgets/SoloText";

// use for display svg on web
import SVGInline from "react-svg-inline";

export default class CoinListItem extends React.PureComponent {

   /*  setNativeProps = (nativeProps) => {
        
    } */

    renderCoinIcon() {
        //check platform
        if(Platform.OS.toUpperCase() ==="WEB"){
            return (
                <SVGInline 
                    width="24" 
                    height="24" 
                    svg={this.props.icon}/>
            );
        } 
        return (
            <SvgUri 
                width={24} 
                height={24} 
                svgXmlData={this.props.icon}/>
        );
    }

    renderCheckCircle() {
        //check platform
        if(Platform.OS.toUpperCase() ==="WEB"){
            return (
                <SVGInline 
                    width="20" 
                    height="20" 
                    svg={icons.icCheckCircle}
                    fill={colorPrimary}
                    style={{
                        position: 'absolute',
                        right: 0
                    }}
                />
            );
        } 
        return (
            <SvgUri
                width={20}
                height={20}
                svgXmlData={icons.icCheckCircle}
                fill={colorPrimary}
                style={{
                    position: 'absolute',
                    right: 0
                }}
            />
        );
    }

    render() {
        let isHandleItemClick = this.props.onItemClicked || false;
        console.log(isHandleItemClick);
        let textRateMargin = this.props.checked ? 30 : 0;

        return (
            <TouchableOpacity
                onPress={() => {
                    console.log("isHandleItemClick");
                    if (isHandleItemClick) {
                        this.props.onItemClicked(this.props.id)
                    }
                }}
                {...this.props}
                style={[styles.container, {...this.props.style}]}
                disabled={!isHandleItemClick}>

                <View style={styles.content}>
                    {this.renderCoinIcon()}
                    <SoloText style={styles.label}>{this.props.label}</SoloText>

                    <SoloText
                        style={[styles.text_rate, {marginRight: textRateMargin}]}>{"0 usd".toUpperCase()}</SoloText>
                    {
                        this.props.checked &&
                        this.renderCheckCircle()
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
        color: colorTitleText,
        fontFamily: fontBold,
        marginLeft: 10,
        paddingBottom: 5,
    },
    text_rate: {
        color: colorContentText,
        fontSize: 12,
        position: 'absolute',
        right: 0,
    },
    dash: {
        width: '100%',
        height: 1,
        backgroundColor: colorDisable,
    },
});

CoinListItem.propTypes = {
    checked: PropTypes.bool,
    onItemClicked: PropTypes.func,
    icon: PropTypes.string,
    label: PropTypes.string,
};