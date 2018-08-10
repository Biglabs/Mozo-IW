import React from "react";
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {inject} from "mobx-react";

import {
    colorPrimary,
    colorScreenBackground,
    colorTitleText,
    dimenScreenPaddingHorizontal,
    dimenScreenPaddingTop,
    fontBold,
    icons,
} from "../../../res";
import {ScreenHeaderActions, SvgView, Text} from "../../components";
import Constant from "../../../helpers/Constants";
import {isWebPlatform, isIOS} from "../../../helpers/PlatformUtils";
import {WalletBackupService} from '../../../services';
import { strings } from '../../../helpers/i18nUtils';

const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

@inject("backupWalletStateStore")
export default class BackupWalletExportScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {qrCodeData: null}
    }

    componentWillUnmount() {
        this.state.qrCodeData = null;
    }

    handleRef(ref, svgRef) {
        if(this.state.qrCodeData !== null) return;
        setTimeout(() => {
            if (isWebPlatform() && ref !== null) {
                this.setState({qrCodeData: ref});

            } else if(svgRef !== null) {
                svgRef.toDataURL(base64Data => {
                    this.setState({qrCodeData: base64Data});
                });
            }
        }, 1000);
    }

    doExport(fileType) {
        const ignoreError = WalletBackupService.ERROR.USER_DENIED;
        if (this.state.qrCodeData != null) {
            WalletBackupService.backupWallet(fileType, this.props.encryptedData, this.state.qrCodeData)
                .then(() => {
                    this.props.backupWalletStateStore.setBackupWalletState(true);
                })
                .catch(err => {
                    if (err.message && err.message !== ignoreError) {
                        Alert.alert(
                            Constant.ERROR_TYPE.CANNOT_BACKUP_WALLET.title,
                            Constant.ERROR_TYPE.CANNOT_BACKUP_WALLET.detail,
                            [{text: strings('alert.btnOK')}]
                        );
                    }
                });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScreenHeaderActions title='Backup Wallet'/>
                <View style={[styles.view_contain, styles.view_result]}>
                    <Text>Your encrypted wallet:</Text>
                    <View style={styles.image_qr_code}>
                        <QRCode
                            size={200}
                            value={this.props.encryptedData}
                            ref={ref => this.handleRef(ref, null)}
                            getRef={ref => this.handleRef(null, ref)}
                        />
                    </View>
                    <Text style={styles.export_explain_text}>
                        From the destination device, go to
                        <Text style={styles.export_explain_text_highlight}> Welcome screen </Text>
                        >
                        <Text style={styles.export_explain_text_highlight}> Restore Encrypted Wallet </Text>
                        and scan this QR code{'\n'}or save as file for restore later
                    </Text>
                    {
                        this.state.qrCodeData &&
                        <View style={styles.export_container}>
                            <TouchableOpacity
                                style={styles.export_button}
                                onPress={() => this.doExport(Constant.BACKUP_FILE_TYPE.PNG)}>
                                <SvgView
                                    width={32}
                                    height={32}
                                    fill={colorPrimary}
                                    svg={icons.icExportQR}/>

                                <Text style={styles.export_button_text}>{'\n'}QR Image file</Text>
                            </TouchableOpacity>
                            {
                                !isIOS &&
                                <TouchableOpacity
                                    style={styles.export_button}
                                    onPress={() => this.doExport(Constant.BACKUP_FILE_TYPE.TXT)}>
                                    <SvgView
                                        width={32}
                                        height={32}
                                        fill={colorPrimary}
                                        svg={icons.icExportText}/>
                                    <Text style={styles.export_button_text}>{'\n'}Text file</Text>
                                </TouchableOpacity>
                            }
                        </View>
                  }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: colorScreenBackground,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    view_contain: {
        width: '100%',
        flex: 1,
        paddingTop: dimenScreenPaddingTop,
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal,
    },
    view_result: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    image_qr_code: {
        width: 240,
        height: 240,
        marginTop: 16,
        marginBottom: 20,
        borderColor: '#b4b4b4',
        borderWidth: 1,
        backgroundColor: colorScreenBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    export_container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
    },
    export_explain_text: {
        textAlign: 'center'
    },
    export_explain_text_highlight: {
        fontFamily: fontBold,
    },
    export_button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    export_button_text: {
        fontFamily: fontBold,
        color: colorTitleText
    }
});
