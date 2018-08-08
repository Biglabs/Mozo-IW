import React from "react";
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {
    colorDisable,
    colorPrimary,
    colorScreenBackground,
    colorTitleText,
    dimenScreenPaddingHorizontal,
    icons
} from '../../res';
import {BackupWalletStateIcon, SvgView, Text} from "../components";
import {CachingService, LinkingService} from '../../services';
import {strings} from '../../helpers/i18nUtils';

export default class HomeScreen extends React.Component {

    componentDidMount() {
        this.manageScheme();
    }

    manageScheme() {
        let storage = CachingService.getInstance();
        let schemeData = storage.getSchemeData();
        if (schemeData) {
            LinkingService.manageScheme(schemeData, this.props.pin);
            CachingService.getInstance().setSchemeData(null);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <SvgView
                        width={78}
                        height={36}
                        fill={colorPrimary}
                        svg={icons.icSoloTitle}
                        style={{
                            marginBottom: 10,
                        }}/>
                </View>

                <TouchableOpacity
                    style={[styles.buttons, {marginTop: 20}]}
                    onPress={() => Actions.backup_wallet_menu({pin: this.props.pin})}>
                    <SvgView
                        width={24}
                        height={20}
                        fill={colorPrimary}
                        svg={icons.icBackup}/>
                    <Text style={[styles.buttons_text, {marginLeft: 7}]}>{strings('home.btnBackup')}</Text>

                    <BackupWalletStateIcon/>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgView
                            width={20}
                            height={20}
                            svg={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.dash}/>

                <TouchableOpacity style={styles.buttons}>
                    <SvgView
                        width={20}
                        height={20}
                        fill={colorPrimary}
                        svg={icons.icSync}/>
                    <Text style={styles.buttons_text}>{strings('home.btnPair')}</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgView
                            width={20}
                            height={20}
                            svg={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.dash}/>

                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => Actions.paper_wallet()}>
                    <SvgView
                        width={20}
                        height={20}
                        fill={colorPrimary}
                        svg={icons.icNote}/>
                    <Text style={styles.buttons_text}>{strings('home.btnPaper')}</Text>

                    <TouchableOpacity style={styles.buttons_icon}>
                        <SvgView
                            width={20}
                            height={20}
                            svg={icons.icInformation}/>
                    </TouchableOpacity>
                </TouchableOpacity>

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