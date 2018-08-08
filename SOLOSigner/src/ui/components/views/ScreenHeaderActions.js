'use strict';

import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from "react-native";

import {Actions} from 'react-native-router-flux';
import PropTypes from 'prop-types';

import {colorPrimary, colorScreenBackground, colorTitleText, fontBold, icons} from '../../../res';
import SoloText from "../widgets/SoloText";
import SvgView from "../widgets/SoloSVG";
import { strings } from '../../../helpers/i18nUtils';

export default class ScreenHeaderActions extends React.Component {
    constructor(props) {
        super(props);

        this.backgroundColor = props.backgroundColor || colorScreenBackground;
        this.backIconColor = props.accentColor || colorPrimary;
        this.backTextColor = props.accentColor || colorTitleText;
        this.titleColor = props.accentColor || colorPrimary;
        this.onPressAction = props.onBackPress || this.onBackPress;
    }

    onBackPress = () => {
        Actions.pop();
    };

    render() {
        return (
            <View {...this.props} style={[styles.toolbar, {backgroundColor: this.backgroundColor}, this.props.style]}>

                <TouchableOpacity style={styles.button} onPress={this.onPressAction}>
                    <SvgView
                        width={8}
                        height={13}
                        fill={this.backIconColor}
                        svg={icons.icArrowBack}
                        style={{
                            marginLeft: 16,
                            marginRight: 6,
                        }}
                    />
                    <SoloText style={[styles.button_text, {color: this.backTextColor}]}>{strings('navigation_bar.btnBack')}</SoloText>
                </TouchableOpacity>

                <SoloText style={[styles.title, {color: this.titleColor}]}>
                    {
                        (this.props.title || 'screen title').toUpperCase()
                    }
                </SoloText>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    toolbar: {
        width: '100%',
        height: 64,
        backgroundColor: colorScreenBackground,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        shadowColor: '#7ba3d8',
        shadowOffset: {width: 0, height: 3.5},
        shadowOpacity: 0.25,
        shadowRadius: 11,
        elevation: 6,
        flexDirection: 'row',
    },
    button: {
        flex: 0.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 10,
        paddingTop: 10,
    },
    button_text: {
        fontSize: 14,
        color: colorTitleText,
        paddingBottom: 3,
    },
    title: {
        flex: 0.6,
        fontFamily: fontBold,
        fontSize: 16,
        color: colorPrimary,
        paddingBottom: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
        ...Platform.select({
            android: {includeFontPadding: false}
        }),
    }
});

ScreenHeaderActions.propTypes = {
    title: PropTypes.string,
    backgroundColor: PropTypes.string,
    accentColor: PropTypes.string,
    onBackPress: PropTypes.func,
};