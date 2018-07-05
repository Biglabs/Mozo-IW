import React from "react";
import {View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {FooterActions, SelectionGroup, Text, WalletButton} from "../../components/SoloComponent";
import {icFlash, icSettings} from '../../res/icons';

export default class CreateWalletScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedIndex: -1}
    }

    render() {
        return (
            <View style={styles.container}>

                <Text style={StyleSheet.value('$screen_title_text')}>Create New Wallet</Text>

                <SelectionGroup
                    onSelectionChanged={(index) => {
                        this.setState({
                            selectedIndex: index
                        });
                    }}>
                    <WalletButton label="Express"
                                  content="Select this option if you’d like to access your new SOLO Wallet quickly. Please note that you’ll always be able to customize at a later time."
                                  icon={icFlash}
                                  style={styles.buttons}/>

                    <WalletButton title="Custom"
                                  content="Select this option if you’d like to customize your wallet. You’ll be able to select your wallet Tokens and Currencies, set up a security PIN, and back up your wallet."
                                  icon={icSettings}
                                  style={styles.buttons}/>
                </SelectionGroup>

                <FooterActions
                    onBackPress={() => Actions.pop()}
                    enabledContinue={this.state.selectedIndex >= 0}
                    onContinuePress={() => {
                        switch (this.state.selectedIndex) {
                            case 0:
                                Actions.security_pin({isNewPIN : true});
                                break;
                            case 1:
                                Actions.add_wallet();
                                break;
                        }
                    }}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: '$screenBackground',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: '$screen_padding_horizontal',
        paddingRight: '$screen_padding_horizontal',
    },
    buttons: {
        width: '100%'
    },
});