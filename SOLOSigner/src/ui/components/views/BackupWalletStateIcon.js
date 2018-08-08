'use strict';

import React from "react";
import {View} from 'react-native';
import {inject, observer} from "mobx-react";

import {icCheck, icWarning} from "../../../res/icons";
import SvgView from '../widgets/SoloSVG';

@inject("backupWalletStateStore")
@observer
export default class BackupWalletStateIcon extends React.Component {
    render() {
        if (this.props.backupWalletStateStore.backupWalletState >= 0) {
            return <SvgView
                width={20}
                height={20}
                svg={this.props.backupWalletStateStore.backupWalletState === 1 ? icCheck : icWarning}
                style={{margin: 9}}/>
        } else
            return <View/>
    }
}