'use strict';

import React, {Component} from 'react';
import {TouchableOpacity, View} from "react-native";
import SvgUri from 'react-native-svg-uri';
import StyleSheet from "react-native-extended-stylesheet";
import Text from "./SoloText";
import {Actions} from 'react-native-router-flux';

export default class NavigationBarView extends Component {
    constructor(props) {
        super(props);

        const primaryColor = StyleSheet.value('$primaryColor');
        this.backgroundColor = props.backgroundColor || StyleSheet.value('$screenBackground');
        this.backIconColor = props.accentColor || primaryColor;
        this.backTextColor = props.accentColor || StyleSheet.value('$textTitleColor');
        this.titleColor = props.accentColor || primaryColor;
    }

    render() {
        return (
            <View {...this.props} style={[styles.toolbar, {backgroundColor: this.backgroundColor}, this.props.style]}>

                <TouchableOpacity style={styles.button} onPress={() => Actions.pop()}>
                    <SvgUri
                        width={8}
                        height={13}
                        fill={this.backIconColor}
                        source={require('../res/icons/ic_arrow_back.svg')}
                        style={{
                            marginLeft: 16,
                            marginRight: 6,
                        }}/>
                    <Text style={[styles.button_text, {color: this.backTextColor}]}>Back</Text>
                </TouchableOpacity>

                <Text style={[styles.title, {color: this.titleColor}]}>
                    {
                        (this.props.title || 'screen title').toUpperCase()
                    }
                </Text>
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