import React from "react";
import {AsyncStorage, StyleSheet, TouchableOpacity, View, Platform} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {Actions} from 'react-native-router-flux';

import {
    colorDisable,
    colorPrimary,
    colorScreenBackground,
    colorTitleText,
    dimenScreenPaddingHorizontal,
    icons
} from '../../res';
import {BackupWalletStateIcon, Text} from "../components";
import LinkingManager from "../../services/LinkingService";
import CachingService from '../../services/CachingService';

// use for display svg on web
import SVGInline from "react-svg-inline";

export default class HomeScreen extends React.Component {

    componentDidMount() {
        this.manageScheme();
    }

    manageScheme() {
        let storage = CachingService.getInstance();
        let schemeData = storage.getSchemeData();
        if (schemeData) {
            LinkingManager.manageScheme(schemeData, this.props.pin);
            CachingService.getInstance().setSchemeData(null);
        }
    }


    displayIcSoloTitle(){
        //check platform
        if(Platform.OS.toUpperCase() ==="WEB"){
            return (
                <View style={styles.toolbar}>
                    <SVGInline
                        width="78"
                        height="36"
                        fill={colorPrimary}
                        svg={icons.icSoloTitle}
                        style={{
                            marginBottom: 10,
                        }}
                    /> 
                </View>
            );
        }else {
            return (
                <View style={styles.toolbar}>
                    <SvgUri
                        width={78}
                        height={36}
                        fill={colorPrimary}
                        svgXmlData={icons.icSoloTitle}
                        style={{
                            marginBottom: 10,
                        }}/>
                </View>
            );
        }
    }

    displayBackupWallet (){
        if(Platform.OS.toUpperCase() ==="WEB"){
            return (
                <TouchableOpacity
                    style={[styles.buttons, {marginTop: 20}]}
                    onPress={() => Actions.backup_wallet_menu({pin: this.props.pin})}>
                    <SVGInline
                        width="24"
                        height="20"
                        fill={colorPrimary}
                        svg={icons.icBackup}
                    /> 
                    <Text style={[styles.buttons_text, {marginLeft: 7}]}>Backup Wallet</Text>

                    <BackupWalletStateIcon/>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SVGInline
                            width="20"
                            height="20"
                            svg={icons.icInformation}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={[styles.buttons, {marginTop: 20}]}
                    onPress={() => Actions.backup_wallet_menu({pin: this.props.pin})}>
                    <SvgUri
                        width={24}
                        height={20}
                        fill={colorPrimary}
                        svgXmlData={icons.icBackup}/>
                    <Text style={[styles.buttons_text, {marginLeft: 7}]}>Backup Wallet</Text>

                    <BackupWalletStateIcon/>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            svgXmlData={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity>
            );
        }
    }

    displayPairDevices(){
        if(Platform.OS.toUpperCase() ==="WEB"){
            return(
                <TouchableOpacity style={styles.buttons}>
                    <SVGInline
                        width="20"
                        height="20"
                        fill={colorPrimary}
                        svg={icons.icSync}/>
                    <Text style={styles.buttons_text}>Pair Devices</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SVGInline
                            width="20"
                            height="20"
                            svg={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity>
            );
        } else {
            return(
                <TouchableOpacity style={styles.buttons}>
                    <SvgUri
                        width={20}
                        height={20}
                        fill={colorPrimary}
                        svgXmlData={icons.icSync}/>
                    <Text style={styles.buttons_text}>Pair Devices</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            svgXmlData={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity>
            );
        }
    }

    displayPaperWallet() {
        if(Platform.OS.toUpperCase() ==="WEB"){
            return (
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => Actions.paper_wallet()}>
                    <SVGInline
                        width="20"
                        height="20"
                        fill={colorPrimary}
                        svg={icons.icNote}/>
                    <Text style={styles.buttons_text}>Paper Wallet</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SVGInline
                            width="20"
                            height="20"
                            svg={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => Actions.paper_wallet()}>
                    <SvgUri
                        width={20}
                        height={20}
                        fill={colorPrimary}
                        svgXmlData={icons.icNote}/>
                    <Text style={styles.buttons_text}>Paper Wallet</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            svgXmlData={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity>
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <View style={styles.toolbar}>
                    <SvgUri
                        width={78}
                        height={36}
                        fill={colorPrimary}
                        svgXmlData={icons.icSoloTitle}
                        style={{
                            marginBottom: 10,
                        }}/>
                </View> */}
                {this.displayIcSoloTitle()}

                {/* <TouchableOpacity
                    style={[styles.buttons, {marginTop: 20}]}
                    onPress={() => Actions.backup_wallet_menu({pin: this.props.pin})}>
                    <SvgUri
                        width={24}
                        height={20}
                        fill={colorPrimary}
                        svgXmlData={icons.icBackup}/>
                    <Text style={[styles.buttons_text, {marginLeft: 7}]}>Backup Wallet</Text>

                    <BackupWalletStateIcon/>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            svgXmlData={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity> */}
                {this.displayBackupWallet()}
                
                <View style={styles.dash}/>

                {/* <TouchableOpacity style={styles.buttons}>
                    <SvgUri
                        width={20}
                        height={20}
                        fill={colorPrimary}
                        svgXmlData={icons.icSync}/>
                    <Text style={styles.buttons_text}>Pair Devices</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            svgXmlData={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity> */}
                {this.displayPairDevices()}

                <View style={styles.dash}/>

                {/* <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => Actions.paper_wallet()}>
                    <SvgUri
                        width={20}
                        height={20}
                        fill={colorPrimary}
                        svgXmlData={icons.icNote}/>
                    <Text style={styles.buttons_text}>Paper Wallet</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgUri
                            width={20}
                            height={20}
                            svgXmlData={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity> */}
                {this.displayPaperWallet()}

                <View style={styles.dash}/>

                <View style={styles.content}>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colorScreenBackground,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    toolbar: {
        width: '100%',
        height: 83,
        backgroundColor: colorScreenBackground,
        justifyContent: 'flex-end',
        alignItems: 'center',
        shadowColor: '#7ba3d8',
        shadowOffset: {width: 0, height: 3.5},
        shadowOpacity: 0.25,
        shadowRadius: 11,
        elevation: 6,
    },
    buttons: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    buttons_text: {
        color: colorTitleText,
        fontSize: 14,
        marginLeft: 11,
        paddingBottom: 4,
    },
    buttons_icon: {
        height: '100%',
        position: 'absolute',
        top: 0,
        right: 0,
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dash: {
        width: '84%',
        height: 1,
        backgroundColor: colorDisable,
        marginLeft: dimenScreenPaddingHorizontal,
        marginRight: dimenScreenPaddingHorizontal,
    },
    content: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
});