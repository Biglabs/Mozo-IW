import React from 'react';
import {Provider} from "mobx-react";
import stores from "./common/stores";
import {Router, Modal, Scene, Stack, Lightbox} from 'react-native-router-flux';
/* initial common styles */
import './res/common.styles.js';

/* general screens */
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import SecurityPinScreen from './screens/SecurityPinScreen';

/* wallet screens */
import AddWalletScreen from './screens/wallet/AddWalletScreen';
import AddMoreWalletScreen from './screens/wallet/AddMoreWalletScreen';
import CreateWalletScreen from './screens/wallet/CreateWalletScreen';
import ImportWalletScreen from './screens/wallet/ImportWalletScreen';
import RestoreWalletScreen from './screens/wallet/RestoreWalletScreen';
import BackupWalletMenuScreen from './screens/wallet/BackupWalletMenuScreen';
import PaperWalletScreen from './screens/wallet/PaperWalletScreen';

/* backup screens */
import BackupWalletScreen from './screens/backup/BackupWalletScreen';
import ConfirmBackupPhrase from './screens/backup/ConfirmBackupPhrase';
import ViewBackupPhrase from './screens/backup/ViewBackupPhrase';

/* transaction screens */
import ConfirmationScreen from './screens/transaction/ConfirmationScreen';

import ExportQRCode from './components/lightbox/ExportQRCode';
import ScanQRCode from './components/lightbox/ScanQRCode';
import Bip44 from './screens/Bip44';
import Bip38 from './screens/Bip38';
import LinkingManager from "./utils/LinkingManager";
import {Linking} from 'react-native';

Linking.getInitialURL().then((url) => {
    LinkingManager.checkScheme(url);
});
Linking.addEventListener('url', LinkingManager.handleEventOpenUrl);

export default () => {
    return (
        <Provider {...stores}>
            <Router>
                <Modal key="root" hideNavBar>
                    {/* general screens */}
                    <Scene key="splash" component={SplashScreen} hideNavBar initial type="reset"/>
                    <Scene key="welcome" component={WelcomeScreen} hideNavBar type="reset"/>
                    <Scene key="security_pin" component={SecurityPinScreen} hideNavBar/>
                    <Stack back backTitle="Home" key="main_stack" type="reset">
                        <Scene key="home" component={HomeScreen} hideNavBar/>
                        <Scene key="tab_bip44" title="44" component={Bip44}/>
                        <Scene key="tab_bip38" title="38" component={Bip38}/>
                    </Stack>

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
                    <Scene key="confirm_backup_phrase" component={ConfirmBackupPhrase} hideNavBar/>
                    <Scene key="view_backup_phrase" component={ViewBackupPhrase} hideNavBar/>

                    {/* transaction screens */}
                    <Scene key="trans_confirm" component={ConfirmationScreen} hideNavBar/>

                    <Lightbox key="lightbox">
                        <Scene key="export_qrcode" component={ExportQRCode}/>
                    </Lightbox>
                    <Scene key="scan_qrcode" component={ScanQRCode}/>
                </Modal>
            </Router>
        </Provider>
    );
};
