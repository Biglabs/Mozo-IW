'use strict';

import SoloButton from './SoloButton';
import SoloSelectionGroup from './SoloSelectionGroup';
import SoloWalletButton from './SoloWalletButton';
import SoloText from './SoloText';
import SoloTextInput from './SoloTextInput';
import CoinItemView from './CoinItemView';
import RotationView from './RotationView';
import FadeInView from './FadeInView';
import FooterActions from './FooterActions';
import NavigationBarView from './NavigationBarView';
import BackupWalletStateIcon from './BackupWalletStateIcon';

const SoloComponent = {
    Button: SoloButton,
    SelectionGroup: SoloSelectionGroup,
    WalletButton: SoloWalletButton,
    Text: SoloText,
    TextInput: SoloTextInput,
    CoinItemView: CoinItemView,
    RotationView: RotationView,
    FadeInView: FadeInView,
    FooterActions: FooterActions,
    NavigationBar: NavigationBarView,
    BackupWalletStateIcon: BackupWalletStateIcon,
};

module.exports = SoloComponent;