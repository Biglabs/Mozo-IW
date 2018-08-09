import React from "react";
import {StyleSheet, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { strings } from '../../../helpers/i18nUtils';

import {CreateWalletOptionItem, ScreenFooterActions, SelectionGroup, Text} from "../../components";
import {colorScreenBackground, dimenScreenPaddingHorizontal, icons, styleScreenTitleText} from '../../../res';
import AsyncStorage from "../../../helpers/AsyncStorageUtils";
import Constant from "../../../helpers/Constants";

export default class CreateWalletScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedIndex: -1}
    }

    onContinueClick = () => {
        AsyncStorage.setItem(Constant.FLAG_BACKUP_WALLET, 'false');
        switch (this.state.selectedIndex) {
            case 0:
                Actions.security_pin({isNewPIN: true});
                break;
            case 1:
                Actions.add_wallet();
                break;
        }
    };

    render() {
        return (
            <View style={styles.container}>

                <Text style={styleScreenTitleText}>{strings('create_wallet.lbTitle')}</Text>

                <SelectionGroup
                    onSelectionChanged={(index) => {
                        this.setState({
                            selectedIndex: index
                        });
                    }}>
                    <CreateWalletOptionItem label={strings('create_wallet.lbExpress')}
                                            content={strings('create_wallet.lbExpressDetail')}
                                            icon={icons.icFlash}
                                            style={styles.buttons}/>

                    <CreateWalletOptionItem label={strings('create_wallet.lbCustom')}
                                            content={strings('create_wallet.lbCustomDetail')}
                                            icon={icons.icSettings}
                                            style={styles.buttons}/>
                </SelectionGroup>

                <ScreenFooterActions
                    onBackPress={() => Actions.pop()}
                    enabledContinue={this.state.selectedIndex >= 0}
                    onContinuePress={this.onContinueClick}/>
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
        paddingLeft: dimenScreenPaddingHorizontal,
        paddingRight: dimenScreenPaddingHorizontal,
    },
    buttons: {
        width: '100%'
    },
});