'use strict';

import React from "react";
import {View} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {inject, observer} from "mobx-react";
import {icCheck, icWarning} from "../../../res/icons/index";

@inject("backupWalletStateStore")
@observer
export default class BackupWalletStateIcon extends React.Component {
    render() {
        if (this.props.backupWalletStateStore.backupWalletState >= 0) {
            return (<SvgUri
                width={20}
                height={20}
                svgXmlData={this.props.backupWalletStateStore.backupWalletState === 1 ? icCheck : icWarning}
                style={{margin: 9}}/>)
        } else return (<View/>)
    }
}