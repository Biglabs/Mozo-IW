import React from 'react';
import {Router, Modal, Scene, Stack, Lightbox} from 'react-native-router-flux';
/* initial common styles */
import './res/common.styles.js';
/* handle open URL scheme when app resume from background */
import './utils/LinkingManager';

import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import SecurityPinScreen from './screens/SecurityPinScreen';

/* wallet screens */
import AddWalletScreen from './screens/wallet/AddWalletScreen';
import CreateWalletScreen from './screens/wallet/CreateWalletScreen';
import ImportWalletScreen from './screens/wallet/ImportWalletScreen';
import BackupWalletScreen from './screens/wallet/BackupWalletScreen';
import PaperWalletScreen from './screens/wallet/PaperWalletScreen';

/* transaction screens */
import ConfirmationScreen from './screens/transaction/ConfirmationScreen';

import ExportQRCode from './components/lightbox/ExportQRCode';
import ScanQRCode from './components/lightbox/ScanQRCode';
import Bip39 from './screens/Bip39';
import Bip44 from './screens/Bip44';
import Bip38 from './screens/Bip38';

export default () => {
    return (
        <Router>
            <Modal key="root" hideNavBar>

                <Scene key="splash" component={SplashScreen} hideNavBar initial type="reset"/>
                <Scene key="welcome" component={WelcomeScreen} hideNavBar type="reset"/>
                <Scene key="security_pin" component={SecurityPinScreen} hideNavBar/>

                <Scene key="add_wallet" component={AddWalletScreen} hideNavBar/>
                <Scene key="create_wallet" component={CreateWalletScreen} hideNavBar/>
                <Scene key="import_wallet" component={ImportWalletScreen} hideNavBar/>
                <Scene key="backup_wallet" component={BackupWalletScreen} hideNavBar/>
                <Scene key="paper_wallet" component={PaperWalletScreen} hideNavBar/>

                <Scene key="trans_confirm" component={ConfirmationScreen} hideNavBar/>

                <Stack back backTitle="Home" key="main_stack" type="reset">
                    <Scene key="home" component={HomeScreen} hideNavBar/>
                    <Scene key="tab_bip39" title="39" component={Bip39}/>
                    <Scene key="tab_bip44" title="44" component={Bip44}/>
                    <Scene key="tab_bip38" title="38" component={Bip38}/>
                </Stack>


                <Lightbox key="lightbox">
                    <Scene key="export_qrcode" component={ExportQRCode} />
                </Lightbox>
                <Scene key="scan_qrcode" component={ScanQRCode}/>
            </Modal>
        </Router>
    );
};
