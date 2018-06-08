import React, {Component} from 'react';
import {Text} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';
import SvgUri from 'react-native-svg-uri';

import SplashScreen from './screens/SplashScreen';
import Bip39 from './screens/Bip39';
import Bip44 from './screens/Bip44';
import Bip38 from './screens/Bip38';

const TabIcon = ({selected, title}) => {
    return (
        <SvgUri source={require('./images/ic_monetization.svg')}/>
    );
};

const App = () => {
    return (
        <Router>
            <Scene key="root">

                <Scene key="splash" component={SplashScreen} hideNavBar/>

                <Scene key="tabbar" tabs={true} tabBarStyle={{backgroundColor: '#FFFFFF'}} hideNavBar>
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

            </Scene>
        </Router>
    );
};

export default App;