import React from "react";
import {StyleSheet, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {CreateWalletOptionItem, ScreenFooterActions, SelectionGroup, Text} from "../../components";
import {colorScreenBackground, dimenScreenPaddingHorizontal, icons, styleScreenTitleText} from '../../../res';

export default class CreateWalletScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedIndex: -1}
    }

    onContinueClick = () => {
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

                <Text style={styleScreenTitleText}>Create New Wallet</Text>

                <SelectionGroup
                    onSelectionChanged={(index) => {
                        this.setState({
                            selectedIndex: index
                        });
                    }}>
                    <CreateWalletOptionItem label="Express"
                                            content="Select this option if you’d like to access your new SOLO Wallet quickly. Please note that you’ll always be able to customize at a later time."
                                            icon={icons.icFlash}
                                            style={styles.buttons}/>

                    <CreateWalletOptionItem title="Custom"
                                            content="Select this option if you’d like to customize your wallet. You’ll be able to select your wallet Tokens and Currencies, set up a security PIN, and back up your wallet."
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