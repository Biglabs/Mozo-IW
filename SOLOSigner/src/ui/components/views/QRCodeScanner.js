'use strict';

import React from "react";
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {RNCamera} from 'react-native-camera';
import PropTypes from 'prop-types';

import {colorPrimary, fontBold, icons} from "../../../res";
import SoloText from '../widgets/SoloText';

export default class QRCodeScanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isScanning: props.scanning || false};
        this.cameraSize = props.cameraSize || 180;
        this.scanAreaSize = this.cameraSize + 20;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isScanning: nextProps.isScanning || false
        });
    }

    onPress = () => {
        this.setState({
            isScanning: !this.state.isScanning
        }, () => {
            if (this.props.onScanStatusChange) {
                this.props.onScanStatusChange(this.state.isScanning);
            }
        });
    };

    onCodeRead = (event) => {
        if (this.props.onCodeRead && event) {
            this.props.onCodeRead(event.data);
        }
        this.onPress.call();
    };

    render() {
        return <View style={styles.container}>
            <TouchableOpacity
                style={{width: this.scanAreaSize, height: this.scanAreaSize,}}
                disabled={this.state.isScanning}
                onPress={this.onPress}>
                <SvgUri width={this.scanAreaSize} height={this.scanAreaSize} svgXmlData={icons.icScanArea}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: -1,
                        }}/>
                {
                    this.state.isScanning &&
                    <RNCamera
                        style={{width: this.cameraSize, height: this.cameraSize, margin: 10}}
                        ratio='1:1'
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                        onBarCodeRead={this.onCodeRead}/>
                }
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.scan_button}
                onPress={this.onPress}>
                <SoloText style={styles.scan_button_text}>
                    {
                        this.state.isScanning ? 'Cancel' : 'Scan QR Code'
                    }
                </SoloText>
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    scan_button: {
        paddingLeft: 10,
        paddingTop: 4,
        paddingRight: 10,
        paddingBottom: 5,
    },
    scan_button_text: {
        color: colorPrimary,
        fontFamily: fontBold,
        padding: 5
    }
});

QRCodeScanner.propTypes = {
    scanning: PropTypes.bool,
    cameraSize: PropTypes.number,
    onCodeRead: PropTypes.func.isRequired,
    onScanStatusChange: PropTypes.func,
};