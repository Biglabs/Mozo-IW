'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View} from "react-native";
import SvgUri from 'react-native-svg-uri';
import StyleSheet from "react-native-extended-stylesheet";
import SoloText from "../widgets/SoloText";
import {Actions} from 'react-native-router-flux';
import {icArrowBack} from '../../../res/icons';

export default class ScreenHeaderActions extends React.Component {
    constructor(props) {
        super(props);

        const primaryColor = StyleSheet.value('$primaryColor');
        this.backgroundColor = props.backgroundColor || StyleSheet.value('$screenBackground');
        this.backIconColor = props.accentColor || primaryColor;
        this.backTextColor = props.accentColor || StyleSheet.value('$textTitleColor');
        this.titleColor = props.accentColor || primaryColor;
        this.onPressAction = props.onBackPress || this.onBackPress;
    }

    onBackPress = () => {
        Actions.pop();
    };

    render() {
        return (
            <View {...this.props} style={[styles.toolbar, {backgroundColor: this.backgroundColor}, this.props.style]}>

                <TouchableOpacity style={styles.button} onPress={this.onPressAction}>
                    <SvgUri
                        width={8}
                        height={13}
                        fill={this.backIconColor}
                        svgXmlData={icArrowBack}
                        style={{
                            marginLeft: 16,
                            marginRight: 6,
                        }}/>
                    <SoloText style={[styles.button_text, {color: this.backTextColor}]}>Back</SoloText>
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
        backgroundColor: '$screenBackground',
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
        color: '$textTitleColor',
        paddingBottom: 3,
    },
    title: {
        flex: 0.6,
        fontFamily: '$primaryFontBold',
        fontSize: 16,
        color: '$primaryColor',
        paddingBottom: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
    }
});

ScreenHeaderActions.propTypes = {
    title: PropTypes.string,
    backgroundColor: PropTypes.string,
    accentColor: PropTypes.string,
    onBackPress: PropTypes.func,
};