'use strict';

import React from "react";
import {View, Platform} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {inject, observer} from "mobx-react";
import {icCheck, icWarning} from "../../../res/icons";

// use for display svg on web
import SVGInline from "react-svg-inline";

@inject("backupWalletStateStore")
@observer
export default class BackupWalletStateIcon extends React.Component {
    render() {
        if (this.props.backupWalletStateStore.backupWalletState >= 0) {
            //check platform
            if(Platform.OS.toUpperCase() ==="WEB"){
                return (<SVGInline
                    width="20"
                    height="20"
                    svg={this.props.backupWalletStateStore.backupWalletState === 1 ? icCheck : icWarning}
                    style={{margin: 9}}/>)
            } else {
                return (<SvgUri
                    width={20}
                    height={20}
                    svgXmlData={this.props.backupWalletStateStore.backupWalletState === 1 ? icCheck : icWarning}
                    style={{margin: 9}}/>)
            }
        } else return (<View/>)
    }
}