import React from 'react';
import {BackHandler, Linking} from 'react-native';
import {Modal, Router, Scene} from 'react-native-router-flux';
import {Provider} from "mobx-react";

import stores from "./stores";

/* general screens */
import SplashScreen from './ui/screens/SplashScreen';
import WelcomeScreen from './ui/screens/WelcomeScreen';
import HomeScreen from './ui/screens/HomeScreen';
import SecurityPinScreen from './ui/screens/SecurityPinScreen';

/* wallet screens */
import AddWalletScreen from './ui/screens/wallet/AddWalletScreen';
import AddMoreWalletScreen from './ui/screens/wallet/AddMoreWalletScreen';
import CreateWalletScreen from './ui/screens/wallet/CreateWalletScreen';
import ImportWalletScreen from './ui/screens/wallet/ImportWalletScreen';
import BackupWalletMenuScreen from './ui/screens/wallet/BackupWalletMenuScreen';
import PaperWalletScreen from './ui/screens/wallet/PaperWalletScreen';

/* backup screens */
import BackupWalletScreen from './ui/screens/backup/BackupWalletScreen';
import RestoreWalletScreen from './ui/screens/backup/RestoreWalletScreen';
import BackupPhraseDisplayScreen from './ui/screens/backup/BackupPhraseDisplayScreen';
import BackupPhraseConfirmScreen from './ui/screens/backup/BackupPhraseConfirmScreen';
import ViewBackupPhrase from './ui/screens/backup/ViewBackupPhraseScreen';
import ConfirmationScreen from './ui/screens/transaction/ConfirmationScreen';

import {isWebPlatform} from "./helpers/PlatformUtils";

/**
 * Load services base on running platform
 */
(function initServices() {
    if (isWebPlatform()) {

    } else {
        const LinkingService = require("./services/LinkingService");
        Linking.getInitialURL().then((url) => {
            LinkingService.checkScheme(url);
        });
        Linking.addEventListener('url', LinkingService.handleEventOpenUrl);
    }
}());

export default () => {
    return (
        <Provider {...stores}>
            <Router>
                <Modal key="root" hideNavBar>
                    {/* general screens */}
                    <Scene key="splash" component={SplashScreen} hideNavBar initial type="reset"/>
                    <Scene key="welcome" component={WelcomeScreen} hideNavBar type="reset"/>
                    <Scene key="security_pin" component={SecurityPinScreen} hideNavBar/>
                    <Scene key="home" component={HomeScreen} hideNavBar type="reset"/>

                    {/* wallet screens */}
                    <Scene key="add_wallet" component={AddWalletScreen} hideNavBar/>
                    <Scene key="add_more_wallet" component={AddMoreWalletScreen} hideNavBar/>
                    <Scene key="create_wallet" component={CreateWalletScreen} hideNavBar/>
                    <Scene key="import_wallet" component={ImportWalletScreen} hideNavBar/>
                    <Scene key="restore_wallet" component={RestoreWalletScreen} hideNavBar/>
                    <Scene key="backup_wallet_menu" component={BackupWalletMenuScreen} hideNavBar/>
                    <Scene key="paper_wallet" component={PaperWalletScreen} hideNavBar/>

                    {/* backup screens */}
                    <Scene key="backup_wallet" component={BackupWalletScreen} hideNavBar/>
                    <Scene key="backup_phrase_display" component={BackupPhraseDisplayScreen} hideNavBar
                           onEnter={() => {
                               this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                                   /* return true to disable hardware back button */
                                   return true;
                               });
                           }}
                           onExit={() => {
                               this.backHandler.remove();
                           }}/>
                    <Scene key="backup_phrase_confirm" component={BackupPhraseConfirmScreen} hideNavBar/>
                    <Scene key="view_backup_phrase" component={ViewBackupPhrase} hideNavBar/>

                    {/* transaction screens */}
                    <Scene key="trans_confirm" component={ConfirmationScreen} hideNavBar/>
                </Modal>
            </Router>
        </Provider>
    );
};
