import React from 'react';
import {Router, Modal, Scene} from 'react-native-router-flux';
import SvgUri from 'react-native-svg-uri';
import EStyleSheet from 'react-native-extended-stylesheet';

import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import Bip39 from './screens/Bip39';
import Bip44 from './screens/Bip44';
import Bip38 from './screens/Bip38';

EStyleSheet.build({
    $primaryColor: '#006DFF',
    $screenBackground: '#FFFFFF'
});

const TabIcon = ({selected, title}) => {
    return (
        <SvgUri source={require('./res/images/ic_monetization.svg')}/>
    );
};

export default () => {
    return (
        <Router>
            <Modal key="root" hideNavBar>

                <Scene key="splash" component={SplashScreen} hideNavBar/>

                <Scene key="welcome" component={WelcomeScreen} hideNavBar/>

                <Scene key="main_tab_bar" tabs={true} tabBarStyle={{backgroundColor: '#FFFFFF'}} tabBarPosition="bottom" hideNavBar>
                    <Scene key="tab_bip39" title="39" icon={TabIcon}>
                        <Scene
                            key="bip39"
                            component={Bip39}
                            hideNavBar
                        />
                    </Scene>
                    <Scene key="tab_bip44" title="44" icon={TabIcon}>
                        <Scene
                            key="bip4"
                            component={Bip44}
                            hideNavBar
                        />
                    </Scene>
                    <Scene key="tab_bip38" title="38" icon={TabIcon}>
                        <Scene
                            key="bip38"
                            component={Bip38}
                            hideNavBar
                        />
                    </Scene>
                </Scene>

            </Modal>
        </Router>
    );
};