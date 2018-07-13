'use strict';

import SoloButton from './SoloButton';
import SoloSelectionGroup from './SoloSelectionGroup';
import SoloWalletButton from './SoloWalletButton';
import SoloText from './SoloText';
import SoloTextInput from './SoloTextInput';
import FadeInView from './FadeInView';
import FooterActions from './FooterActions';
import NavigationBarView from './NavigationBarView';

const SoloComponent = {
    Button: SoloButton,
    SelectionGroup: SoloSelectionGroup,
    WalletButton: SoloWalletButton,
    Text: SoloText,
    TextInput: SoloTextInput,
    FadeInView: FadeInView,
    FooterActions: FooterActions,
    NavigationBar: NavigationBarView,
};

module.exports = SoloComponent;