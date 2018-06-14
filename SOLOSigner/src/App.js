import React from 'react';
import {Router, Modal, Scene, Lightbox} from 'react-native-router-flux';
import SvgUri from 'react-native-svg-uri';
import './res/common.styles.js'; // initial common styles

import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AddWalletScreen from './screens/wallet/AddWalletScreen';
import CreateWalletScreen from './screens/wallet/CreateWalletScreen';
import ImportWalletScreen from './screens/wallet/ImportWalletScreen';
import ConfirmationScreen from './screens/transaction/ConfirmationScreen';

import ExportQRCode from './components/lightbox/ExportQRCode';
import ScanQRCode from './components/lightbox/ScanQRCode';

import Bip39 from './screens/Bip39';
import Bip44 from './screens/Bip44';
import Bip38 from './screens/Bip38';
import './screens/LinkingManager';

const TabIcon = ({selected, title}) => {
    return (
        <SvgUri source={require('./res/icons/ic_monetization.svg')}/>
    );
};

export default () => {
    return (
        <Router>
            <Modal key="root" hideNavBar>

                <Scene key="splash" component={SplashScreen} hideNavBar initial/>
                <Scene key="welcome" component={WelcomeScreen} hideNavBar type="reset"/>
                <Scene key="add_wallet" component={AddWalletScreen} hideNavBar/>
                <Scene key="create_wallet" component={CreateWalletScreen} hideNavBar/>
                <Scene key="import_wallet" component={ImportWalletScreen} hideNavBar/>

                <Scene key="trans_confirm" component={ConfirmationScreen} hideNavBar/>

                <Scene key="main_tab_bar"
                       tabs={true}
                       tabBarStyle={{backgroundColor: '#FFFFFF'}}
                       tabBarPosition="bottom"
                       hideNavBar
                       type="reset">
                    <Scene key="tab_bip39" title="39" icon={TabIcon} component={Bip39} hideNavBar/>
                    <Scene key="tab_bip44" title="44" icon={TabIcon} component={Bip44} hideNavBar/>
                    <Scene key="tab_bip38" title="38" icon={TabIcon} component={Bip38} hideNavBar/>
                </Scene>

                <Lightbox key="lightbox">
                    <Scene key="export_qrcode" component={ExportQRCode} />
                </Lightbox>
                <Scene key="scan_qrcode" component={ScanQRCode}/>
            </Modal>
        </Router>
    );
};
